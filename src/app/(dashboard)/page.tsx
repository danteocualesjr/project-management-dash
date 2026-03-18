'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { TasksDueSoon } from '@/components/dashboard/tasks-due-soon';
import { TeamOverview } from '@/components/dashboard/team-overview';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
      <StatsCards />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TasksDueSoon />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
      <TeamOverview />
    </div>
  );
}
