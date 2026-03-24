'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { useTeams } from '@/hooks/use-teams';
import { useUser } from '@/hooks/use-user';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useUser();
  useTeams();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Sidebar />
      <div className="ml-64 flex flex-col min-w-0">
        <Header />
        <main className="p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
