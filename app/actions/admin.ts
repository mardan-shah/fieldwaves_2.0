'use server';

import { z } from 'zod';
import { GlobalSettings, Project, TeamMember, Admin } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import bcrypt from 'bcryptjs';

// Schema Validation
const ProjectSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
  techStack: z.string().optional(),
});

const TeamMemberSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  bio: z.string().optional(),
  socialLinks: z.string().optional(), // JSON string
  backgroundColor: z.string().optional(),
});

const AdminAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// --- Admin Auth Actions ---

export async function checkAdminExists() {
  await connectToDatabase();
  const count = await Admin.countDocuments();
  return { exists: count > 0 };
}

export async function createAdmin(formData: FormData) {
  await connectToDatabase();
  
  // Security check: Only allow creation if no admin exists
  const count = await Admin.countDocuments();
  if (count > 0) {
    return { error: 'Admin already exists' };
  }

  const validated = AdminAuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) return { error: 'Invalid input' };

  const { email, password } = validated.data;
  const passwordHash = await bcrypt.hash(password, 10);

  await Admin.create({
    email,
    passwordHash,
    isOwner: true,
  });

  return { success: true };
}

export async function verifyAdmin(formData: FormData) {
  await connectToDatabase();

  const validated = AdminAuthSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validated.success) return { error: 'Invalid input' };

  const { email, password } = validated.data;
  const admin = await Admin.findOne({ email });

  if (!admin) return { error: 'Invalid credentials' };

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) return { error: 'Invalid credentials' };

  return { success: true };
}

// --- Content Actions ---

export async function toggleSoloMode() {
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

export async function addProject(formData: FormData) {
  await connectToDatabase();

  const validatedFields = ProjectSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
    techStack: formData.get('techStack'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { title, url, techStack } = validatedFields.data;

  // 3-second delay for screenshot capture
  const screenshotUrl = `https://image.thum.io/get/wait/3000/width/600/crop/800/${url}`;
  
  // Process techStack (comma-separated string to array)
  const techStackArray = techStack 
    ? techStack.split(',').map(t => t.trim()).filter(Boolean)
    : ['Next.js', 'React', 'MongoDB']; // Default if empty

  await Project.create({
    title,
    liveUrl: url,
    screenshotUrl,
    techStack: techStackArray,
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteProject(id: string) {
  await connectToDatabase();
  await Project.findByIdAndDelete(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function addTeamMember(formData: FormData) {
  await connectToDatabase();

  const validatedFields = TeamMemberSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    bio: formData.get('bio'),
    socialLinks: formData.get('socialLinks'),
    backgroundColor: formData.get('backgroundColor'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, role, bio, socialLinks, backgroundColor } = validatedFields.data;
  
  // Handle File Upload
  const file = formData.get('avatar') as File;
  let avatarUrl = '';

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Trim filename and sanitize
    const originalName = file.name.trim().replace(/\s+/g, '-');
    const fileName = `${Date.now()}-${originalName}`;
    const path = join(process.cwd(), 'public/team', fileName);
    
    await writeFile(path, buffer);
    avatarUrl = `/team/${fileName}`;
  } else {
    // Fallback if provided as text URL or empty
    avatarUrl = (formData.get('avatarUrl') as string) || '/placeholder-user.jpg';
  }

  // Parse social links (JSON string -> Map)
  let socialLinksMap = new Map();
  if (socialLinks) {
    try {
      const parsed = JSON.parse(socialLinks);
      // parsed should be array of { platform, url }
      if (Array.isArray(parsed)) {
        parsed.forEach((link: any) => {
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
    isOwner: false, // Default to false
  });

  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function getAllTeamMembers() {
  await connectToDatabase();
  const members = await TeamMember.find().sort({ order: 1, _id: -1 }).lean();
  return members.map(m => ({ ...m, _id: m._id.toString() }));
}

export async function deleteTeamMember(id: string) {
  await connectToDatabase();
  await TeamMember.findByIdAndDelete(id);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
