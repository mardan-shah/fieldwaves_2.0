'use server'

import connectToDatabase from '@/lib/db';
import { Project, TeamMember, GlobalSettings } from '@/lib/models';
import { Resend } from 'resend';
import { z } from 'zod';

import nodemailer from 'nodemailer';

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
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  message: z.string().min(10),
});

export async function submitContactForm(formData: FormData) {
  const validatedFields = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: formData.get('company'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { name, email, company, message } = validatedFields.data;

  try {
    // 1. Send Lead Notification via Gmail (Guaranteed Delivery)
    await transporter.sendMail({
      from: `"FieldWaves System" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `[NEW_LEAD] Inquiry from ${name}`,
      text: `
SYSTEM_NOTIFICATION: NEW_CLIENT_INQUIRY
----------------------------------------
NAME:    ${name}
EMAIL:   ${email}
COMPANY: ${company || 'N/A'}
DATE:    ${new Date().toLocaleString()}

MESSAGE_BODY:
${message}
----------------------------------------
      `,
    });

    // 2. Client Confirmation Workflow
    let confirmationSent = false;

    // Try Resend first (Branded)
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'ssss') {
      try {
        const res = await resend.emails.send({
          from: 'FieldWaves <contact@fieldwaves.com>',
          to: email,
          subject: 'We have received your request - FieldWaves',
          text: `Hello ${name},\n\nThank you for reaching out to FieldWaves. We have received your inquiry and our team is currently reviewing your project details. You can expect a response within 24 hours.`,
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
        text: `Hello ${name},\n\nThis is an automated confirmation that we have received your inquiry. Our team will contact you within 24 hours.\n\nBest regards,\nFieldWaves Team`,
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('Lead Notification Failed:', err);
    return { error: `NOTIFICATION_FAILURE: ${err.message || 'Check Gmail credentials'}` };
  }
}

export async function getProjects() {
  await connectToDatabase();
  let projects = await Project.find().sort({ _id: -1 }).lean();
  
  if (projects.length === 0) {
    console.log('Seeding Projects...');
    await Project.insertMany(INITIAL_PROJECTS);
    projects = await Project.find().sort({ _id: -1 }).lean();
  }
  
  // Convert _id to string for serialization
  return projects.map(p => ({ ...p, _id: p._id.toString() }));
}

export async function getTeam() {
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

  const result = team.map(t => ({ ...t, _id: t._id.toString() }));

  if (settings?.soloMode) {
    return result.filter(m => m.isOwner);
  }
  
  return result;
}

export async function getSettings() {
  await connectToDatabase();
  let settings = await GlobalSettings.findOne().lean();
  if (!settings) {
     await GlobalSettings.create(INITIAL_SETTINGS);
     settings = await GlobalSettings.findOne().lean();
  }
  return settings ? { ...settings, _id: settings._id.toString() } : null;
}
