'use client';

import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { useAppStore } from '@/store/use-app-store';
import { useTeams } from '@/hooks/use-teams';
import { useUser } from '@/hooks/use-user';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore();
  useUser();
  useTeams();

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <div className={cn(
        'transition-[margin] duration-150',
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      )}>
        <Header />
        <main className="p-6 max-w-[1280px]">{children}</main>
      </div>
    </div>
  );
}
