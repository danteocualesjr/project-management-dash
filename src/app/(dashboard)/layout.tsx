'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { useTeams } from '@/hooks/use-teams';
import { useUser } from '@/hooks/use-user';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useUser();
  useTeams();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex flex-col min-w-0">
        <Header />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
