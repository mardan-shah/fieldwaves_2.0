'use server'

import connectToDatabase from '@/lib/db';
import { Project, TeamMember, GlobalSettings } from '@/lib/models';
import { Resend } from 'resend';
import { z } from 'zod';

import nodemailer from 'nodemailer';
import { buildClientConfirmationEmail, buildAdminNotificationEmail } from '@/lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

// Configure Nodemailer for reliable lead delivery
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Initial Data for Seeding
const INITIAL_SETTINGS = {
  soloMode: false,
  maintenanceMode: false,
};

const INITIAL_TEAM = [
  {
    name: 'Alex "Root" Mercer',
    role: 'Principal Architect',
    bio: 'Specializing in high-availability distributed systems and kernel-level optimizations.',
    avatarUrl: 'https://picsum.photos/seed/alex/400/400',
    socialLinks: { github: 'https://github.com', twitter: 'https://twitter.com' },
    isOwner: true,
    order: 1,
  },
  {
    name: 'Sarah "Zero" Chen',
    role: 'Security Lead',
    bio: 'Offensive security specialist. If it connects to the internet, I can break it.',
    avatarUrl: 'https://picsum.photos/seed/sarah/400/400',
    socialLinks: { linkedin: 'https://linkedin.com' },
    isOwner: false,
    order: 2,
  },
  {
    name: 'Marcus "Voxel" Davis',
    role: 'Creative Technologist',
    bio: 'WebGL shader wizardry and brutalist UI implementation.',
    avatarUrl: 'https://picsum.photos/seed/marcus/400/400',
    socialLinks: { github: 'https://github.com' },
    isOwner: false,
    order: 3,
  }
];

const INITIAL_PROJECTS = [
  {
    title: 'HYPER_GRID Financial',
    liveUrl: 'https://example.com',
    screenshotUrl: 'https://picsum.photos/seed/finance/600/400',
    techStack: ['Rust', 'WASM', 'Next.js'],
  },
  {
    title: 'ORBITAL Logistics',
    liveUrl: 'https://example.com',
    screenshotUrl: 'https://picsum.photos/seed/logistics/600/400',
    techStack: ['Go', 'gRPC', 'Kubernetes'],
  }
];

const ContactSchema = z.object({
  name: z.string().min(2).max(100, 'Name too long').regex(/^[^\r\n]+$/, 'Name contains invalid characters'),
  email: z.string().email().max(254, 'Email too long'),
  company: z.string().max(200, 'Company name too long').optional(),
  message: z.string().min(10).max(5000, 'Message too long'),
});

// --- Contact Form Rate Limiting ---
const CONTACT_ATTEMPTS = new Map<string, { count: number; resetAt: number }>();
const CONTACT_MAX = 5;
const CONTACT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkContactRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const record = CONTACT_ATTEMPTS.get(key);

  if (!record || now > record.resetAt) {
    CONTACT_ATTEMPTS.set(key, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= CONTACT_MAX) {
    return { allowed: false, retryAfterMs: record.resetAt - now };
  }

  record.count++;
  return { allowed: true };
}

export async function submitContactForm(formData: FormData) {
  // Rate limit by submitted email
  const submittedEmail = (formData.get('email') as string) || '';
  const rateCheck = checkContactRateLimit(`contact_${submittedEmail.toLowerCase()}`);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterMs || 0) / 60000);
    return { error: `Too many submissions. Try again in ${minutes} minutes.` };
  }

  const validatedFields = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.entries(errors).find(([, msgs]) => msgs && msgs.length > 0);
    const message = firstError
      ? `${firstError[0]}: ${firstError[1]?.[0]}`
      : 'Invalid fields';
    return { error: message };
  }

  const { name, email, company, message } = validatedFields.data;

  const adminEmail = buildAdminNotificationEmail({
    name,
    email,
    company: company || undefined,
    message,
    date: new Date().toLocaleString(),
  });

  const clientEmail = buildClientConfirmationEmail(name, message);

  try {
    // 1. Send Lead Notification via Gmail (Guaranteed Delivery)
    await transporter.sendMail({
      from: `"FieldWaves System" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `[NEW_LEAD] Inquiry from ${name}`,
      html: adminEmail.html,
      text: adminEmail.text,
    });

    // 2. Client Confirmation Workflow
    let confirmationSent = false;

    // Try Resend first (Branded)
    if (process.env.RESEND_API_KEY) {
      try {
        const res = await resend.emails.send({
          from: 'FieldWaves <contact@fieldwaves.com>',
          to: email,
          subject: 'We have received your request - FieldWaves',
          html: clientEmail.html,
          text: clientEmail.text,
        });
        if (!res.error) confirmationSent = true;
      } catch (e) {
        console.warn('Resend failed, falling back to Gmail for confirmation');
      }
    }

    // Fallback to Gmail if Resend failed or was skipped
    if (!confirmationSent) {
      await transporter.sendMail({
        from: `"FieldWaves" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Inquiry Received - FieldWaves',
        html: clientEmail.html,
        text: clientEmail.text,
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Lead Notification Failed:', err);
    return { error: 'Failed to send message. Please try again later.' };
  }
}

export async function getProjects(): Promise<{ _id: string; title: string; description: string; liveUrl: string; screenshotUrl: string; techStack: string[]; order: number }[]> {
  await connectToDatabase();
  let projects = await Project.find().sort({ order: 1, _id: -1 }).lean();

  if (projects.length === 0) {
    console.log('Seeding Projects...');
    await Project.insertMany(INITIAL_PROJECTS);
    projects = await Project.find().sort({ order: 1, _id: -1 }).lean();
  }

  return projects.map(p => ({
    _id: p._id.toString(),
    title: p.title,
    description: (p as any).description || '',
    liveUrl: p.liveUrl,
    screenshotUrl: p.screenshotUrl,
    techStack: p.techStack,
    order: (p as any).order || 0,
  }));
}

export async function getTeam(): Promise<{ _id: string; name: string; role: string; bio: string; socialLinks: Record<string, string>; avatarUrl: string; backgroundColor: string; isOwner: boolean; order: number }[]> {
  await connectToDatabase();
  
  // Check settings first
  let settings = await GlobalSettings.findOne().lean();
  if (!settings) {
     await GlobalSettings.create(INITIAL_SETTINGS);
     settings = await GlobalSettings.findOne().lean();
  }

  let team = await TeamMember.find().sort({ order: 1 }).lean();
  
  if (team.length === 0) {
    console.log('Seeding Team...');
    await TeamMember.insertMany(INITIAL_TEAM);
    team = await TeamMember.find().sort({ order: 1 }).lean();
  }

  const result = team.map(t => ({
    _id: t._id.toString(),
    name: t.name,
    role: t.role,
    bio: t.bio || '',
    socialLinks: t.socialLinks instanceof Map
      ? Object.fromEntries(t.socialLinks)
      : (t.socialLinks || {}),
    avatarUrl: t.avatarUrl || '/placeholder-user.jpg',
    backgroundColor: t.backgroundColor || 'transparent',
    isOwner: t.isOwner || false,
    order: t.order || 0,
  }));

  if (settings?.soloMode) {
    return result.filter(m => m.isOwner);
  }

  return result;
}

export async function getSettings(): Promise<{ soloMode: boolean; maintenanceMode: boolean } | null> {
  await connectToDatabase();
  let settings = await GlobalSettings.findOne().lean();
  if (!settings) {
     await GlobalSettings.create(INITIAL_SETTINGS);
     settings = await GlobalSettings.findOne().lean();
  }
  return settings ? { soloMode: settings.soloMode, maintenanceMode: settings.maintenanceMode } : null;
}
