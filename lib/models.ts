import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Global Settings Schema ---
export interface IGlobalSettings extends Document {
  soloMode: boolean;
  maintenanceMode: boolean;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>({
  soloMode: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
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
  liveUrl: string;
  screenshotUrl: string;
  techStack: string[];
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  liveUrl: { type: String, required: true },
  screenshotUrl: { type: String },
  techStack: [{ type: String }],
});

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

// Singleton Model exports (handling hot-reload in Next.js)
export const GlobalSettings = (mongoose.models.GlobalSettings as Model<IGlobalSettings>) || mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
export const TeamMember = (mongoose.models.TeamMember as Model<ITeamMember>) || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const Project = (mongoose.models.Project as Model<IProject>) || mongoose.model<IProject>('Project', ProjectSchema);
export const Admin = (mongoose.models.Admin as Model<IAdmin>) || mongoose.model<IAdmin>('Admin', AdminSchema);
