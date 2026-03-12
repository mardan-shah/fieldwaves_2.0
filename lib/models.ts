import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Global Settings Schema ---
export interface IGlobalSettings extends Document {
  soloMode: boolean;
  maintenanceMode: boolean;
  casesDisplayCount: number;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>({
  soloMode: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
  casesDisplayCount: { type: Number, default: 3 },
});

// --- Team Member Schema ---
export interface ITeamMember extends Document {
  name: string;
  role: string;
  bio: string;
  socialLinks: Map<string, string>;
  avatarUrl: string;
  backgroundColor: string;
  order: number;
  isOwner: boolean;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  socialLinks: { type: Map, of: String },
  avatarUrl: { type: String },
  backgroundColor: { type: String, default: 'transparent' },
  order: { type: Number, default: 0 },
  isOwner: { type: Boolean, default: false },
});

// --- Project Schema ---
export interface IProject extends Document {
  title: string;
  description: string;
  liveUrl: string;
  screenshotUrl: string;
  techStack: string[];
  order: number;
  featured: boolean;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  liveUrl: { type: String, required: true },
  screenshotUrl: { type: String },
  techStack: [{ type: String }],
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
});

// --- Case Study Schema ---
export interface ICaseStudy extends Document {
  title: string;
  slug: string;
  subtitle: string;
  overview: string;
  description: string;
  coverImage: string;
  metricCards: { label: string; value: string; unit: string }[];
  techStack: string[];
  published: boolean;
  featured: boolean;
  order: number;
  views: number;
}

const MetricCardSchema = new Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String, required: true },
}, { _id: false });

const CaseStudySchema = new Schema<ICaseStudy>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  subtitle: { type: String, default: '' },
  overview: { type: String, default: '' },
  description: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  metricCards: { type: [MetricCardSchema], default: [] },
  techStack: [{ type: String }],
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

// --- Blog Post Schema ---
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  keywords: string[];
  tags: string[];
  author: string;
  published: boolean;
  featured: boolean;
  order: number;
  views: number;
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, default: '' },
  content: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  keywords: [{ type: String }],
  tags: [{ type: String }],
  author: { type: String, default: '' },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

// --- Page View Schema ---
export interface IPageView extends Document {
  path: string;
  contentType: 'case_study' | 'blog' | 'page';
  contentId: string;
  date: string;
  count: number;
}

const PageViewSchema = new Schema<IPageView>({
  path: { type: String, required: true },
  contentType: { type: String, required: true, enum: ['case_study', 'blog', 'page'] },
  contentId: { type: String, default: '' },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
});

PageViewSchema.index({ path: 1, date: 1 }, { unique: true });

// --- Admin Schema ---
export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  isOwner: boolean;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isOwner: { type: Boolean, default: true },
});

// --- Service Schema ---
export interface IService extends Document {
  title: string;
  description: string;
  iconName: string; // Lucide icon name string
  features: string[];
  order: number;
  active: boolean;
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, required: true, default: 'Cpu' },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});

// Singleton Model exports (handling hot-reload in Next.js)
export const GlobalSettings = (mongoose.models.GlobalSettings as Model<IGlobalSettings>) || mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
export const TeamMember = (mongoose.models.TeamMember as Model<ITeamMember>) || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const Project = (mongoose.models.Project as Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema);
export const CaseStudy = (mongoose.models.CaseStudy as Model<ICaseStudy>) || mongoose.model<ICaseStudy>('CaseStudy', CaseStudySchema);
export const BlogPost = (mongoose.models.BlogPost as Model<IBlogPost>) || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
export const PageView = (mongoose.models.PageView as Model<IPageView>) || mongoose.model<IPageView>('PageView', PageViewSchema);
export const Admin = (mongoose.models.Admin as Model<IAdmin>) || mongoose.model<IAdmin>('Admin', AdminSchema);
export const Service = (mongoose.models.Service as Model<IService>) || mongoose.model<IService>('Service', ServiceSchema);
