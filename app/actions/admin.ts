'use server';

import { z } from 'zod';
import { GlobalSettings, Project, TeamMember, Admin, CaseStudy, BlogPost, PageView, Service } from '@/lib/models';
import { revalidatePath, revalidateTag } from 'next/cache';
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
  githubUrl: z.string().max(2000, 'URL too long').optional().nullable().transform(v => (v && v.trim() !== '') ? v.trim() : undefined),
  description: z.string().max(2000, 'Description too long').optional().nullable().transform(v => v ?? undefined),
  techStack: z.string().max(500, 'Tech stack too long').optional().nullable().transform(v => v ?? undefined),
  order: z.coerce.number().min(0).max(9999).optional().nullable().transform(v => v ?? undefined),
});

const TeamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  role: z.string().min(2, 'Role must be at least 2 characters').max(100, 'Role too long'),
  bio: z.string().max(2000, 'Bio too long').optional().nullable().transform(v => v ?? undefined),
  socialLinks: z.string().max(5000, 'Social links data too long').optional().nullable().transform(v => v ?? undefined),
  backgroundColor: z.string().max(20, 'Color value too long').optional().nullable().transform(v => v ?? undefined),
  isOwner: z.string().optional().nullable().transform(v => v ?? undefined),
  order: z.coerce.number().min(0).max(9999).optional().nullable().transform(v => v ?? undefined),
});

const ServiceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
  description: z.string().min(10, 'Description too long').max(2000, 'Description too long'),
  iconName: z.string().max(100, 'Icon name too long'),
  features: z.string().max(5000, 'Features too long'),
  order: z.coerce.number().min(0).max(9999).optional().nullable().transform(v => v ?? undefined),
  active: z.string().optional().nullable().transform(v => v ?? undefined),
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
  revalidateTag('settings', 'max');
  return { success: true };
}

export async function toggleMaintenanceMode() {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  await connectToDatabase();

  const settings = await GlobalSettings.findOne();
  if (!settings) {
    await GlobalSettings.create({ maintenanceMode: true });
  } else {
    settings.maintenanceMode = !settings.maintenanceMode;
    await settings.save();
  }

  revalidatePath('/', 'layout');
  revalidatePath('/admin');
  revalidateTag('settings', 'max');
  return { success: true };
}

export async function updateMaintenanceMessage(message: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  await connectToDatabase();

  const settings = await GlobalSettings.findOne();
  if (!settings) {
    await GlobalSettings.create({ maintenanceMessage: message });
  } else {
    settings.maintenanceMessage = message;
    await settings.save();
  }

  revalidateTag('settings', 'max');
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
    githubUrl: (formData.get('githubUrl') as string) || '',
    description: formData.get('description'),
    techStack: formData.get('techStack'),
    order: formData.get('order'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors };
  }

  const { title, url, githubUrl, description, techStack, order } = validatedFields.data;

  // Handle custom screenshot upload
  const screenshotFile = formData.get('screenshot') as File;
  let screenshotUrl: string;

  if (screenshotFile && screenshotFile.size > 0) {
    screenshotUrl = await saveUploadedFile(screenshotFile, 'projects');
  } else {
    screenshotUrl = '/placeholder.svg';
  }

  // Process techStack (comma-separated string to array)
  const techStackArray = techStack
    ? techStack.split(',').map(t => t.trim()).filter(Boolean)
    : ['Next.js', 'React', 'MongoDB'];

  await Project.create({
    title,
    description: description || '',
    liveUrl: url,
    githubUrl: githubUrl || '',
    screenshotUrl,
    techStack: techStackArray,
    order: order ?? 0,
  });

  revalidatePath('/');
  revalidatePath('/admin');
  revalidateTag('projects', 'max');
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
    githubUrl: (formData.get('githubUrl') as string) || '',
    description: formData.get('description'),
    techStack: formData.get('techStack'),
    order: formData.get('order'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields', details: validatedFields.error.flatten().fieldErrors };
  }

  const { title, url, githubUrl, description, techStack, order } = validatedFields.data;

  const project = await Project.findById(id);
  if (!project) return { error: 'Project not found' };

  // Handle custom screenshot upload
  const screenshotFile = formData.get('screenshot') as File;
  let screenshotUrl = project.screenshotUrl;

  if (screenshotFile && screenshotFile.size > 0) {
    screenshotUrl = await saveUploadedFile(screenshotFile, 'projects');
  }

  const techStackArray = techStack
    ? techStack.split(',').map(t => t.trim()).filter(Boolean)
    : project.techStack;

  project.title = title;
  project.description = description || '';
  project.liveUrl = url;
  project.githubUrl = githubUrl || '';
  project.screenshotUrl = screenshotUrl;
  project.techStack = techStackArray;
  project.order = order ?? project.order;
  await project.save();

  revalidatePath('/');
  revalidatePath('/admin');
  revalidateTag('projects', 'max');
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
  revalidateTag('projects', 'max');
  return { success: true };
}

export async function toggleProjectFeatured(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  const project = await Project.findById(id);
  if (!project) return { error: 'Project not found' };

  project.featured = !project.featured;
  await project.save();

  revalidatePath('/');
  revalidatePath('/admin');
  revalidateTag('projects', 'max');
  return { success: true, featured: project.featured };
}

export async function reorderItem(collection: 'project' | 'team' | 'case_study' | 'blog' | 'service', id: string, direction: 'up' | 'down') {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();

  const ModelMap: Record<string, any> = { project: Project, team: TeamMember, case_study: CaseStudy, blog: BlogPost, service: Service };
  const Model = ModelMap[collection];

  const item = await Model.findById(id);
  if (!item) return { error: 'Item not found' };

  const currentOrder = item.order || 0;
  const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
  if (newOrder < 0) return { success: true };

  // Swap with the item that has the target order
  const swapItem = await Model.findOne({ order: newOrder });
  if (swapItem) {
    swapItem.order = currentOrder;
    await swapItem.save();
  }

  item.order = newOrder;
  await item.save();

  revalidatePath('/');
  revalidatePath('/admin');
  
  // Instant updates via tags
  if (collection === 'project') revalidateTag('projects', 'max');
  if (collection === 'team') revalidateTag('team', 'max');
  if (collection === 'case_study') revalidateTag('cases', 'max');
  if (collection === 'blog') revalidateTag('blog', 'max');
  if (collection === 'service') revalidateTag('services', 'max');

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
  revalidateTag('team', 'max');
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
  revalidateTag('team', 'max');
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
  revalidateTag('team', 'max');
  return { success: true };
}

export async function getAllTeamMembers() {
  const session = await requireAuth();
  if (!session) return [];

  await connectToDatabase();
  const members = await TeamMember.find().sort({ order: 1, _id: -1 }).lean();
  return members.map(m => ({
    _id: m._id.toString(),
    name: m.name,
    role: m.role,
    bio: m.bio || '',
    socialLinks: m.socialLinks instanceof Map
      ? Object.fromEntries(m.socialLinks)
      : (m.socialLinks || {}),
    avatarUrl: m.avatarUrl || '/placeholder-user.jpg',
    backgroundColor: m.backgroundColor || 'transparent',
    isOwner: m.isOwner || false,
    order: m.order || 0,
  }));
}

export async function deleteTeamMember(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  await TeamMember.findByIdAndDelete(id);
  revalidatePath('/');
  revalidatePath('/admin');
  revalidateTag('team', 'max');
  return { success: true };
}

// --- Case Study Actions ---

const CaseStudyZodSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
  subtitle: z.string().max(200, 'Subtitle too long').optional(),
  overview: z.string().max(500, 'Overview too long').optional(),
  description: z.string().max(50000, 'Description too long').optional(),
  techStack: z.string().max(500, 'Tech stack too long').optional(),
  metricCards: z.string().max(5000, 'Metric cards data too long').optional(),
  published: z.string().optional(),
  order: z.coerce.number().min(0).max(9999).optional(),
});

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug;
  let suffix = 2;
  while (true) {
    const query: any = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await CaseStudy.findOne(query);
    if (!existing) return candidate;
    candidate = `${slug}-${suffix}`;
    suffix++;
  }
}

export async function addCaseStudy(formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  await connectToDatabase();

  const validated = CaseStudyZodSchema.safeParse({
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    overview: formData.get('overview'),
    description: formData.get('description'),
    techStack: formData.get('techStack'),
    metricCards: formData.get('metricCards'),
    published: formData.get('published'),
    order: formData.get('order'),
  });

  if (!validated.success) {
    return { error: 'Invalid fields', details: validated.error.flatten().fieldErrors };
  }

  const { title, subtitle, overview, description, techStack, metricCards, published, order } = validated.data;

  const slug = await ensureUniqueSlug(generateSlug(title));

  // Handle cover image upload
  const coverFile = formData.get('coverImage') as File;
  let coverImage = '';
  if (coverFile && coverFile.size > 0) {
    coverImage = await saveUploadedFile(coverFile, 'cases');
  }

  // Parse tech stack
  const techStackArray = techStack
    ? techStack.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  // Parse metric cards
  let metricCardsArray: { label: string; value: string; unit: string }[] = [];
  if (metricCards) {
    try {
      metricCardsArray = JSON.parse(metricCards);
    } catch (e) {
      console.error('Failed to parse metric cards', e);
    }
  }

  await CaseStudy.create({
    title,
    slug,
    subtitle: subtitle || '',
    overview: overview || '',
    description: description || '',
    coverImage,
    metricCards: metricCardsArray,
    techStack: techStackArray,
    published: published === 'true',
    order: order ?? 0,
  });

  revalidatePath('/cases');
  revalidatePath('/admin');
  revalidateTag('cases', 'max');
  return { success: true };
}

export async function updateCaseStudy(id: string, formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();

  const validated = CaseStudyZodSchema.safeParse({
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    overview: formData.get('overview'),
    description: formData.get('description'),
    techStack: formData.get('techStack'),
    metricCards: formData.get('metricCards'),
    published: formData.get('published'),
    order: formData.get('order'),
  });

  if (!validated.success) {
    return { error: 'Invalid fields', details: validated.error.flatten().fieldErrors };
  }

  const { title, subtitle, overview, description, techStack, metricCards, published, order } = validated.data;

  const caseStudy = await CaseStudy.findById(id);
  if (!caseStudy) return { error: 'Case study not found' };

  // Update slug if title changed
  if (title !== caseStudy.title) {
    caseStudy.slug = await ensureUniqueSlug(generateSlug(title), id);
  }

  // Handle cover image upload
  const coverFile = formData.get('coverImage') as File;
  if (coverFile && coverFile.size > 0) {
    caseStudy.coverImage = await saveUploadedFile(coverFile, 'cases');
  }

  const techStackArray = techStack
    ? techStack.split(',').map(t => t.trim()).filter(Boolean)
    : caseStudy.techStack;

  let metricCardsArray = caseStudy.metricCards;
  if (metricCards) {
    try {
      metricCardsArray = JSON.parse(metricCards);
    } catch (e) {
      console.error('Failed to parse metric cards', e);
    }
  }

  caseStudy.title = title;
  caseStudy.subtitle = subtitle || '';
  caseStudy.overview = overview || '';
  caseStudy.description = description || '';
  caseStudy.metricCards = metricCardsArray;
  caseStudy.techStack = techStackArray;
  caseStudy.published = published === 'true';
  caseStudy.order = order ?? caseStudy.order;
  await caseStudy.save();

  revalidatePath('/cases');
  revalidatePath(`/cases/${caseStudy.slug}`);
  revalidatePath('/admin');
  revalidateTag('cases', 'max');
  return { success: true };
}

export async function deleteCaseStudy(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  await CaseStudy.findByIdAndDelete(id);
  revalidatePath('/cases');
  revalidatePath('/admin');
  revalidateTag('cases', 'max');
  return { success: true };
}

export async function getAllCaseStudies() {
  const session = await requireAuth();
  if (!session) return [];

  await connectToDatabase();
  const cases = await CaseStudy.find().sort({ order: 1, _id: -1 }).lean();
  return cases.map(c => ({
    _id: c._id.toString(),
    title: c.title,
    slug: c.slug,
    subtitle: c.subtitle || '',
    overview: c.overview || '',
    description: c.description || '',
    coverImage: c.coverImage || '',
    metricCards: (c.metricCards || []).map((m: any) => ({
      label: m.label || '',
      value: m.value || '',
      unit: m.unit || ''
    })),
    techStack: c.techStack || [],
    published: c.published,
    featured: (c as any).featured || false,
    order: c.order || 0,
    createdAt: (c as any).createdAt?.toISOString?.() || '',
    updatedAt: (c as any).updatedAt?.toISOString?.() || '',
  }));
}

export async function toggleCaseStudyFeatured(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  const cs = await CaseStudy.findById(id);
  if (!cs) return { error: 'Case study not found' };

  cs.featured = !cs.featured;
  await cs.save();

  revalidatePath('/cases');
  revalidatePath('/admin');
  revalidateTag('cases', 'max');
  return { success: true, featured: cs.featured };
}

export async function updateCasesDisplayCount(count: number) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  if (count < 1 || count > 50) return { error: 'Count must be between 1 and 50' };

  await connectToDatabase();
  const settings = await GlobalSettings.findOne();
  if (!settings) {
    await GlobalSettings.create({ casesDisplayCount: count });
  } else {
    (settings as any).casesDisplayCount = count;
    await settings.save();
  }

  revalidatePath('/cases');
  revalidatePath('/admin');
  revalidateTag('settings', 'max');
  return { success: true };
}

// --- Blog Post Actions ---

const BlogPostZodSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title too long'),
  excerpt: z.string().max(500, 'Excerpt too long').optional().nullable().transform(v => v ?? undefined),
  content: z.string().max(100000, 'Content too long').optional().nullable().transform(v => v ?? undefined),
  keywords: z.string().max(1000, 'Keywords too long').optional().nullable().transform(v => v ?? undefined),
  tags: z.string().max(500, 'Tags too long').optional().nullable().transform(v => v ?? undefined),
  author: z.string().max(100, 'Author too long').optional().nullable().transform(v => v ?? undefined),
  published: z.string().optional().nullable().transform(v => v ?? undefined),
  order: z.coerce.number().min(0).max(9999).optional().nullable().transform(v => v ?? undefined),
});

async function ensureUniqueBlogSlug(slug: string, excludeId?: string): Promise<string> {
  let candidate = slug;
  let suffix = 2;
  while (true) {
    const query: any = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await BlogPost.findOne(query);
    if (!existing) return candidate;
    candidate = `${slug}-${suffix}`;
    suffix++;
  }
}

export async function addBlogPost(formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  await connectToDatabase();

  const validated = BlogPostZodSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    keywords: formData.get('keywords'),
    tags: formData.get('tags'),
    author: formData.get('author'),
    published: formData.get('published'),
    order: formData.get('order'),
  });

  if (!validated.success) {
    return { error: 'Invalid fields', details: validated.error.flatten().fieldErrors };
  }

  const { title, excerpt, content, keywords, tags, author, published, order } = validated.data;

  const slug = await ensureUniqueBlogSlug(generateSlug(title));

  const coverFile = formData.get('coverImage') as File;
  let coverImage = '';
  if (coverFile && coverFile.size > 0) {
    coverImage = await saveUploadedFile(coverFile, 'blog');
  }

  const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
  const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  await BlogPost.create({
    title,
    slug,
    excerpt: excerpt || '',
    content: content || '',
    coverImage,
    keywords: keywordsArray,
    tags: tagsArray,
    author: author || '',
    published: published === 'true',
    order: order ?? 0,
    views: 0,
  });

  revalidatePath('/blog');
  revalidatePath('/admin');
  revalidateTag('blog', 'max');
  return { success: true };
}

export async function updateBlogPost(id: string, formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();

  const validated = BlogPostZodSchema.safeParse({
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    keywords: formData.get('keywords'),
    tags: formData.get('tags'),
    author: formData.get('author'),
    published: formData.get('published'),
    order: formData.get('order'),
  });

  if (!validated.success) {
    return { error: 'Invalid fields', details: validated.error.flatten().fieldErrors };
  }

  const { title, excerpt, content, keywords, tags, author, published, order } = validated.data;

  const post = await BlogPost.findById(id);
  if (!post) return { error: 'Blog post not found' };

  if (title !== post.title) {
    post.slug = await ensureUniqueBlogSlug(generateSlug(title), id);
  }

  const coverFile = formData.get('coverImage') as File;
  if (coverFile && coverFile.size > 0) {
    post.coverImage = await saveUploadedFile(coverFile, 'blog');
  }

  post.title = title;
  post.excerpt = excerpt || '';
  post.content = content || '';
  post.keywords = keywords ? keywords.split(',').map(k => k.trim()).filter(Boolean) : post.keywords;
  post.tags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : post.tags;
  post.author = author || '';
  post.published = published === 'true';
  post.order = order ?? post.order;
  await post.save();

  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath('/admin');
  revalidateTag('blog', 'max');
  return { success: true };
}

export async function toggleBlogPostFeatured(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  const post = await BlogPost.findById(id);
  if (!post) return { error: 'Blog post not found' };

  post.featured = !post.featured;
  await post.save();

  revalidatePath('/blog');
  revalidatePath('/admin');
  revalidateTag('blog', 'max');
  return { success: true, featured: post.featured };
}

export async function deleteBlogPost(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };
  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  await BlogPost.findByIdAndDelete(id);
  revalidatePath('/blog');
  revalidatePath('/admin');
  revalidateTag('blog', 'max');
  return { success: true };
}

export async function getAllBlogPosts() {
  const session = await requireAuth();
  if (!session) return [];

  await connectToDatabase();
  const posts = await BlogPost.find().sort({ order: 1, _id: -1 }).lean();
  return posts.map(p => ({
    _id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    content: p.content || '',
    coverImage: p.coverImage || '',
    keywords: p.keywords || [],
    tags: p.tags || [],
    author: p.author || '',
    published: p.published,
    featured: (p as any).featured || false,
    order: p.order || 0,
    views: p.views || 0,
    createdAt: (p as any).createdAt?.toISOString?.() || '',
    updatedAt: (p as any).updatedAt?.toISOString?.() || '',
  }));
}

// --- Analytics Actions ---

import { connection } from 'next/server';

export async function trackPageView(path: string, contentType: 'case_study' | 'blog' | 'page', contentId: string = '') {
  await connection();
  await connectToDatabase();
  const date = new Date().toISOString().split('T')[0];

  await PageView.findOneAndUpdate(
    { path, date },
    { $inc: { count: 1 }, $setOnInsert: { contentType, contentId } },
    { upsert: true }
  );

  if (contentType === 'blog' && contentId) {
    await BlogPost.findByIdAndUpdate(contentId, { $inc: { views: 1 } });
  } else if (contentType === 'case_study' && contentId) {
    await CaseStudy.findByIdAndUpdate(contentId, { $inc: { views: 1 } });
  }
}

export async function getAnalytics() {
  const session = await requireAuth();
  if (!session) return null;

  await connectToDatabase();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

  const recentViews = await PageView.find({ date: { $gte: dateStr } }).sort({ date: -1 }).lean();

  const totalViews = recentViews.reduce((sum, v) => sum + v.count, 0);

  const viewsByDay: Record<string, number> = {};
  recentViews.forEach(v => {
    viewsByDay[v.date] = (viewsByDay[v.date] || 0) + v.count;
  });

  const pageMap: Record<string, number> = {};
  recentViews.forEach(v => {
    pageMap[v.path] = (pageMap[v.path] || 0) + v.count;
  });
  const topPages = Object.entries(pageMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }));

  const topCases = await CaseStudy.find()
    .sort({ views: -1 })
    .limit(5)
    .select('title slug views')
    .lean();

  const topPosts = await BlogPost.find()
    .sort({ views: -1 })
    .limit(5)
    .select('title slug views')
    .lean();

  return {
    totalViews,
    viewsByDay,
    topPages,
    topCases: topCases.map(c => ({ title: c.title, slug: c.slug, views: (c as any).views || 0 })),
    topPosts: topPosts.map(p => ({ title: p.title, slug: p.slug, views: (p as any).views || 0 })),
  };
}

// --- Service Actions ---

export async function getAdminServices() {
  const session = await requireAuth();
  if (!session) return [];

  await connectToDatabase();
  const services = await Service.find().sort({ order: 1 }).lean();
  return services.map(s => ({
    _id: s._id.toString(),
    title: s.title,
    description: s.description,
    iconName: s.iconName,
    features: s.features.join('\n'),
    order: s.order,
    active: s.active,
  }));
}

export async function saveService(formData: FormData) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    iconName: formData.get('iconName'),
    features: formData.get('features'),
    order: formData.get('order'),
    active: formData.get('active'),
  };

  const validatedFields = ServiceSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, description, iconName, features, order, active } = validatedFields.data;
  const serviceId = formData.get('id') as string;

  await connectToDatabase();

  const serviceData = {
    title,
    description,
    iconName,
    features: features.split('\n').filter(f => f.trim() !== ''),
    order: order || 0,
    active: active === 'true',
  };

  try {
    if (serviceId && validateObjectId(serviceId)) {
      await Service.findByIdAndUpdate(serviceId, serviceData);
    } else {
      await Service.create(serviceData);
    }

    revalidatePath('/services');
    revalidateTag('services', 'max');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Database error' };
  }
}

export async function deleteService(id: string) {
  const session = await requireAuth();
  if (!session) return { error: 'Unauthorized' };

  if (!validateObjectId(id)) return { error: 'Invalid ID' };

  await connectToDatabase();
  try {
    await Service.findByIdAndDelete(id);
    revalidatePath('/services');
    revalidateTag('services', 'max');
    return { success: true };
  } catch (err: any) {
    return { error: err.message || 'Database error' };
  }
}
