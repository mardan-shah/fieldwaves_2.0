'use server'

import connectToDatabase from '@/lib/db';
import { Project, TeamMember, GlobalSettings, CaseStudy, BlogPost, Service } from '@/lib/models';
import { Resend } from 'resend';
import { z } from 'zod';
import { connection } from 'next/server';

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
  // Add timeout and better error handling
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
});

// Initial Data for Seeding
const INITIAL_SETTINGS = {
  soloMode: false,
  maintenanceMode: false,
};

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
    return { error: `Too many attempts. Try again in ${minutes} minutes.` };
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
    console.error('Lead Notification Failed:', {
      message: err.message,
      code: err.code,
      command: err.command,
      stack: err.stack,
    });
    return { error: `Failed to send message: ${err.message || 'Please check your email configuration.'}` };
  }
}

export async function getProjects(): Promise<{ _id: string; title: string; description: string; liveUrl: string; githubUrl: string; screenshotUrl: string; techStack: string[]; order: number; featured: boolean }[]> {
  try {
    await connectToDatabase();
    const projects = await Project.find().sort({ order: 1, _id: -1 }).lean();
    console.log(`[DB] Fetched ${projects.length} projects`);

    return projects.map(p => ({
      _id: p._id.toString(),
      title: p.title,
      description: (p as any).description || '',
      liveUrl: p.liveUrl,
      githubUrl: (p as any).githubUrl || '',
      screenshotUrl: p.screenshotUrl || '/placeholder.svg',
      screenshots: (p as any).screenshots || [],
      techStack: p.techStack,
      order: (p as any).order || 0,
      featured: (p as any).featured || false,
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function getTeam(): Promise<{ _id: string; name: string; role: string; bio: string; socialLinks: Record<string, string>; avatarUrl: string; backgroundColor: string; isOwner: boolean; order: number }[]> {
  try {
    await connectToDatabase();
    
    // Check settings first
    let settings = await GlobalSettings.findOne().lean();
    if (!settings) {
       await GlobalSettings.create(INITIAL_SETTINGS);
       settings = await GlobalSettings.findOne().lean();
    }

    const team = await TeamMember.find().sort({ order: 1 }).lean();
    
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
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return [];
  }
}

export async function getSettings(): Promise<{ soloMode: boolean; maintenanceMode: boolean; maintenanceMessage: string; casesDisplayCount: number } | null> {
  try {
    await connectToDatabase();
    let settings = await GlobalSettings.findOne().lean();
    if (!settings) {
       await GlobalSettings.create(INITIAL_SETTINGS);
       settings = await GlobalSettings.findOne().lean();
    }
    return settings ? { 
      soloMode: settings.soloMode, 
      maintenanceMode: settings.maintenanceMode, 
      maintenanceMessage: settings.maintenanceMessage || "",
      casesDisplayCount: (settings as any).casesDisplayCount ?? 3 
    } : null;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return { soloMode: false, maintenanceMode: false, maintenanceMessage: "", casesDisplayCount: 3 };
  }
}

export async function getServices() {
  try {
    await connectToDatabase();
    const services = await Service.find({ active: true }).sort({ order: 1 }).lean();
    return services.map(s => ({
      _id: s._id.toString(),
      title: s.title,
      description: s.description,
      iconName: s.iconName,
      features: s.features || [],
      order: s.order || 0,
      active: s.active,
    }));
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export async function getCaseStudies() {
  try {
    await connectToDatabase();
    const cases = await CaseStudy.find({ published: true }).sort({ order: 1, _id: -1 }).lean();
    return cases.map(c => ({
      _id: c._id.toString(),
      title: c.title,
      slug: c.slug,
      subtitle: c.subtitle || '',
      overview: c.overview || '',
      description: c.description || '',
      coverImage: c.coverImage || '',
      metricCards: (c.metricCards || []).map((m: any) => ({ label: m.label || '', value: m.value || '', unit: m.unit || '' })),
      techStack: c.techStack || [],
      published: c.published,
      featured: (c as any).featured || false,
      order: c.order || 0,
      views: (c as any).views || 0,
      createdAt: (c as any).createdAt?.toISOString?.() || '',
      updatedAt: (c as any).updatedAt?.toISOString?.() || '',
    }));
  } catch (error) {
    console.error("Failed to fetch case studies:", error);
    return [];
  }
}

export async function getCaseStudyBySlug(slug: string) {
  try {
    await connectToDatabase();
    const c = await CaseStudy.findOne({ slug, published: true }).lean();
    if (!c) return null;
    return {
      _id: c._id.toString(),
      title: c.title,
      slug: c.slug,
      subtitle: c.subtitle || '',
      overview: c.overview || '',
      description: c.description || '',
      coverImage: c.coverImage || '',
      metricCards: (c.metricCards || []).map((m: any) => ({ label: m.label || '', value: m.value || '', unit: m.unit || '' })),
      techStack: c.techStack || [],
      published: c.published,
      featured: (c as any).featured || false,
      order: c.order || 0,
      views: (c as any).views || 0,
      createdAt: (c as any).createdAt?.toISOString?.() || '',
      updatedAt: (c as any).updatedAt?.toISOString?.() || '',
    };
  } catch (error) {
    console.error(`Failed to fetch case study ${slug}:`, error);
    return null;
  }
}

export async function getBlogPosts() {
  try {
    await connectToDatabase();
    const posts = await BlogPost.find({ published: true }).sort({ order: 1, _id: -1 }).lean();
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
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export async function getFeaturedBlogPosts() {
  try {
    await connectToDatabase();
    const posts = await BlogPost.find({ published: true, featured: true }).sort({ order: 1, _id: -1 }).lean();
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
  } catch (error) {
    console.error("Failed to fetch featured blog posts:", error);
    return [];
  }
}

export async function getFeaturedCaseStudies() {
  try {
    await connectToDatabase();
    const cases = await CaseStudy.find({ published: true, featured: true }).sort({ order: 1, _id: -1 }).lean();
    return cases.map(c => ({
      _id: c._id.toString(),
      title: c.title,
      slug: c.slug,
      subtitle: c.subtitle || '',
      overview: c.overview || '',
      description: c.description || '',
      coverImage: c.coverImage || '',
      metricCards: (c.metricCards || []).map((m: any) => ({ label: m.label || '', value: m.value || '', unit: m.unit || '' })),
      techStack: c.techStack || [],
      published: c.published,
      featured: (c as any).featured || false,
      order: c.order || 0,
      views: (c as any).views || 0,
      createdAt: (c as any).createdAt?.toISOString?.() || '',
      updatedAt: (c as any).updatedAt?.toISOString?.() || '',
    }));
  } catch (error) {
    console.error("Failed to fetch featured case studies:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    await connectToDatabase();
    const p = await BlogPost.findOne({ slug, published: true }).lean();
    if (!p) return null;
    return {
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
    };
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug}:`, error);
    return null;
  }
}
