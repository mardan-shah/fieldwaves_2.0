import { getSession } from '@/lib/session';
import { checkAdminExists, getAllTeamMembers } from '../actions/admin';
import { getSettings, getProjects } from '../actions/public';
import type { GlobalSettings, Project, TeamMember } from '@/types';
import AdminDashboard from './_components/AdminDashboard';
import AdminLoginForm from './_components/AdminLoginForm';

export default async function AdminPage() {
  const session = await getSession();

  if (session) {
    // Authenticated — load data and show dashboard
    const [settings, projects, team] = await Promise.all([
      getSettings(),
      getProjects(),
      getAllTeamMembers(),
    ]);

    return (
      <AdminDashboard
        initialSettings={settings as GlobalSettings}
        initialProjects={projects as Project[]}
        initialTeam={team as TeamMember[]}
      />
    );
  }

  // Not authenticated — show login/setup form
  const { exists } = await checkAdminExists();

  return <AdminLoginForm needsSetup={!exists} />;
}
