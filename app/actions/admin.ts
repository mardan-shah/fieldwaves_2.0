'use server';

import { z } from 'zod';
import { GlobalSettings, Project, TeamMember, Admin } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { createSession, destroySession, getSession } from '@/lib/session';

// --- Constants ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// --- Rate Limiting ---
const AUTH_ATTEMPTS = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const record = AUTH_ATTEMPTS.get(key);

  if (!record || now > record.resetAt) {
    AUTH_ATTEMPTS.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterMs: record.resetAt - now };
  }

  record.count++;
  return { allowed: true };
}

// Schema Validation
const ProjectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
  url: z.string().url('Must be a valid URL').max(2000, 'URL too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  techStack: z.string().max(500, 'Tech stack too long').optional(),
  order: z.coerce.number().min(0).max(9999).optional(),
});

const TeamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  role: z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role too long'),
  bio: z.string().max(2000, 'Bio too long').optional(),
  socialLinks: z.string().max(5000, 'Social links data too long').optional(),
  backgroundColor: z.string().max(20, 'Color value too long').optional(),
  isOwner: z.string().optional(),
  order: z.coerce.number().min(0).max(9999).optional(),
});

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]).{8,}$/;

const AdminAuthSchema = z.object({
  email: z.string().email().max(254, 'Email too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password too long'),
});

const AdminCreateSchema = AdminAuthSchema.extend({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(PASSWORD_REGEX, 'Password must include uppercase, lowercase, number, and special character'),
});

// --- Auth Guard ---
async function requireAuth(): Promise<{ email: string } | null> {
  const session = await getSession();
  if (!session) return null;

  // Verify admin still exists in DB
  await connectToDatabase();
  const admin = await Admin.findOne({ email: session.email });
  if (!admin) return null;

  return session;
}

function validateObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

// --- Admin Auth Actions ---

export async function checkAdminExists() {
  await connectToDatabase();
  const count = await Admin.countDocuments();
  return { exists: count > 0 };
}

export async function getSessionStatus() {
  const session = await getSession();
  return { authenticated: !!session };
}

export async function createAdmin(formData: FormData) {
  await connectToDatabase();

  // Rate limit by IP-agnostic key (setup endpoint)
  const rateCheck = checkRateLimit('admin_setup');
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterMs || 0) / 60000);
    return { error: `Too many attempts. Try again in ${minutes} minutes.` };
  }

  // Security check: Only allow creation if no admin exists
  const count = await Admin.countDocuments();
  if (count > 0) {
    return { error: 'Admin already exists' };
  }

  const validated = AdminCreateSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) {
    const errors = validated.error.flatten().fieldErrors;
    const msg = errors.password?.[0] || errors.email?.[0] || 'Invalid input';
    return { error: msg };
  }

  const { email, password } = validated.data;
  const passwordHash = await bcrypt.hash(password, 12);

  await Admin.create({
    email,
    passwordHash,
    isOwner: true,
  });

  await createSession(email);
  return { success: true };
}

export async function verifyAdmin(formData: FormData) {
  await connectToDatabase();

  const email = (formData.get('email') as string) || '';

  // Rate limit by email
  const rateCheck = checkRateLimit(`auth_${email.toLowerCase()}`);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterMs || 0) / 60000);
    return { error: `Too many attempts. Try again in ${minutes} minutes.` };
  }

  const validated = AdminAuthSchema.safeParse({
    email,
    password: formData.get('password'),
  });

  if (!validated.success) return { error: 'Invalid input' };

  const { password } = validated.data;
  const admin = await Admin.findOne({ email: validated.data.email });

  if (!admin) return { error: 'Invalid credentials' };

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) return { error: 'Invalid credentials' };

  await createSession(validated.data.email);
  return { success: true };
}

export async function logoutAdmin() {
  await destroySession();
  return { success: true };
}

// --- Content Actions ---

export async function toggleSoloMode() {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  await connectToDatabase();

  const settings = await GlobalSettings.findOne();
  if (!settings) {
    await GlobalSettings.create({ soloMode: true });
  } else {
    settings.soloMode = !settings.soloMode;
    await settings.save();
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// --- Helper: validate and save uploaded file ---
function validateUploadedFile(file: File): { error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { error: `File too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}` };
  }
  return {};
}

async function saveUploadedFile(file: File, directory: string): Promise<string> {
  const validation = validateUploadedFile(file);
  if (validation.error) throw new Error(validation.error);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate safe filename: UUID + original extension only
  const originalExt = basename(file.name).split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'jpg';
  const fileName = `${crypto.randomUUID()}.${originalExt}`;
  const dirPath = join(process.cwd(), `public/${directory}`);

  await mkdir(dirPath, { recursive: true });

  const filePath = join(dirPath, fileName);
  await writeFile(filePath, buffer);
  return `/${directory}/${fileName}`;
}

// --- Project Actions ---

export async function addProject(formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  await connectToDatabase();

  const validatedFields = ProjectSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    description: formData.get('description'),
    techStack: formData.get('techStack'),
    order: formData.get('order'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors };
  }

  const { title, url, description, techStack, order } = validatedFields.data;

  // Handle custom screenshot upload
  const screenshotFile = formData.get('screenshot') as File;
  let screenshotUrl: string;

  if (screenshotFile && screenshotFile.size > 0) {
    screenshotUrl = await saveUploadedFile(screenshotFile, 'projects');
  } else {
    // Auto-generate via thum.io
    screenshotUrl = `https://image.thum.io/get/wait/3000/width/600/crop/800/${url}`;
  }

  // Process techStack (comma-separated string to array)
  const techStackArray = techStack
    ? techStack.split(',').map(t => t.trim()).filter(Boolean)
    : ['Next.js', 'React', 'MongoDB'];

  await Project.create({
    title,
    description: description || '',
    liveUrl: url,
    screenshotUrl,
    techStack: techStackArray,
    order: order ?? 0,
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateProject(id: string, formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();

  const validatedFields = ProjectSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    description: formData.get('description'),
    techStack: formData.get('techStack'),
    order: formData.get('order'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors };
  }

  const { title, url, description, techStack, order } = validatedFields.data;

  const project = await Project.findById(id);
  if (!project) return { error: 'Project not found' };

  // Handle custom screenshot upload
  const screenshotFile = formData.get('screenshot') as File;
  let screenshotUrl = project.screenshotUrl;

  if (screenshotFile && screenshotFile.size > 0) {
    screenshotUrl = await saveUploadedFile(screenshotFile, 'projects');
  } else if (url !== project.liveUrl) {
    // URL changed, regenerate screenshot
    screenshotUrl = `https://image.thum.io/get/wait/3000/width/600/crop/800/${url}`;
  }

  const techStackArray = techStack
    ? techStack.split(',').map(t => t.trim()).filter(Boolean)
    : project.techStack;

  project.title = title;
  project.description = description || '';
  project.liveUrl = url;
  project.screenshotUrl = screenshotUrl;
  project.techStack = techStackArray;
  project.order = order ?? project.order;
  await project.save();

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteProject(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  await Project.findByIdAndDelete(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

// --- Team Member Actions ---

export async function addTeamMember(formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  await connectToDatabase();

  const validatedFields = TeamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    socialLinks: formData.get('socialLinks'),
    backgroundColor: formData.get('backgroundColor'),
    isOwner: formData.get('isOwner'),
    order: formData.get('order'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors };
  }

  const { name, role, bio, socialLinks, backgroundColor, isOwner, order } = validatedFields.data;

  // Handle File Upload
  const file = formData.get('avatar') as File;
  let avatarUrl = '';

  if (file && file.size > 0) {
    avatarUrl = await saveUploadedFile(file, 'team');
  } else {
    avatarUrl = (formData.get('avatarUrl') as string) || '/placeholder-user.jpg';
  }

  // Parse social links (JSON string -> Map)
  let socialLinksMap = new Map();
  if (socialLinks) {
    try {
      const parsed = JSON.parse(socialLinks);
      if (Array.isArray(parsed)) {
        parsed.forEach((link: { platform?: string; url?: string }) => {
          if (link.platform && link.url) {
            socialLinksMap.set(link.platform, link.url);
          }
        });
      }
    } catch (e) {
      console.error('Failed to parse social links', e);
    }
  }

  await TeamMember.create({
    name,
    role,
    bio,
    avatarUrl,
    socialLinks: socialLinksMap,
    backgroundColor: backgroundColor || 'transparent',
    isOwner: isOwner === 'true',
    order: order ?? 0,
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function updateTeamMember(id: string, formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();

  const validatedFields = TeamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    socialLinks: formData.get('socialLinks'),
    backgroundColor: formData.get('backgroundColor'),
    isOwner: formData.get('isOwner'),
    order: formData.get('order'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors };
  }

  const { name, role, bio, socialLinks, backgroundColor, isOwner, order } = validatedFields.data;

  const member = await TeamMember.findById(id);
  if (!member) return { error: 'Team member not found' };

  // Handle File Upload
  const file = formData.get('avatar') as File;
  if (file && file.size > 0) {
    member.avatarUrl = await saveUploadedFile(file, 'team');
  }

  // Parse social links
  if (socialLinks) {
    try {
      const parsed = JSON.parse(socialLinks);
      const newMap = new Map();
      if (Array.isArray(parsed)) {
        parsed.forEach((link: { platform?: string; url?: string }) => {
          if (link.platform && link.url) {
            newMap.set(link.platform, link.url);
          }
        });
      }
      member.socialLinks = newMap;
    } catch (e) {
      console.error('Failed to parse social links', e);
    }
  }

  member.name = name;
  member.role = role;
  member.bio = bio || '';
  member.backgroundColor = backgroundColor || member.backgroundColor;
  member.isOwner = isOwner === 'true';
  member.order = order ?? member.order;
  await member.save();

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function toggleTeamMemberOwner(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  const member = await TeamMember.findById(id);
  if (!member) return { error: 'Team member not found' };

  member.isOwner = !member.isOwner;
  await member.save();

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function getAllTeamMembers() {
  const session = await requireAuth();
  if (!session) return [];

  await connectToDatabase();
  const members = await TeamMember.find().sort({ order: 1, _id: -1 }).lean();
  return members.map(m => ({ ...m, _id: m._id.toString() }));
}

export async function deleteTeamMember(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  await TeamMember.findByIdAndDelete(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
