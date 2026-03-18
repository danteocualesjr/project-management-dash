'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TasksDueSoon } from '@/components/dashboard/tasks-due-soon';
import { TeamOverview } from '@/components/dashboard/team-overview';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your teams, projects, and tasks.</p>
      </div>
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TasksDueSoon />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <TeamOverview />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
