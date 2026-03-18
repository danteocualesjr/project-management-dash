'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TasksDueSoon } from '@/components/dashboard/tasks-due-soon';
import { TeamOverview } from '@/components/dashboard/team-overview';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your projects and tasks
        </p>
      </div>

      <StatsCards />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TasksDueSoon />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      <TeamOverview />
    </div>
  );
}
