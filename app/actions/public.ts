'use server'

import connectToDatabase from '@/lib/db';
import { Project, TeamMember, GlobalSettings } from '@/lib/models';

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
