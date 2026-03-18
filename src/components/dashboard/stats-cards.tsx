'use client';

import { useDashboardStats } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, CheckSquare, Users, AlertTriangle } from 'lucide-react';

const items = [
  { key: 'total_projects', label: 'Projects', icon: FolderKanban },
  { key: 'total_tasks', label: 'Total tasks', icon: CheckSquare },
  { key: 'completed_tasks', label: 'Completed', icon: CheckSquare },
  { key: 'overdue_tasks', label: 'Overdue', icon: AlertTriangle },
  { key: 'total_teams', label: 'Teams', icon: Users },
  { key: 'tasks_due_soon', label: 'Due this week', icon: AlertTriangle },
] as const;

export function StatsCards() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <div key={item.key} className="rounded-lg border p-4">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];
        return (
          <div key={item.key} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-xs">{item.label}</span>
            </div>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        );
      })}
    </div>
  );
}
