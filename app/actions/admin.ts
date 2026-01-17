'use server';

import { z } from 'zod';
import { GlobalSettings, Project } from '@/lib/models';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/lib/db';

// Schema Validation
const ProjectSchema = z.object({
  title: z.string().min(2),
  url: z.string().url(),
});

export async function toggleSoloMode() {
  // const session = await auth();
  // if (!session?.user?.email) throw new Error('Unauthorized');
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
  // const session = await auth();
  // if (!session?.user?.email) throw new Error('Unauthorized');
  await connectToDatabase();

  const validatedFields = ProjectSchema.safeParse({
    title: formData.get('title'),
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  const { title, url } = validatedFields.data;

  // Auto-capture screenshot URL (Placeholder service)
  const screenshotUrl = `https://image.thum.io/get/width/600/crop/800/${url}`;

  await Project.create({
    title,
    liveUrl: url,
    screenshotUrl,
    techStack: ['Next.js', 'React', 'MongoDB'], // Default for demo
  });

  revalidatePath('/');
  return { success: true };
}

export async function deleteProject(id: string) {
  // const session = await auth();
  // if (!session?.user?.email) throw new Error('Unauthorized');
  await connectToDatabase();

  await Project.findByIdAndDelete(id);

  revalidatePath('/');
  return { success: true };
}
