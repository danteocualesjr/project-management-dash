'use client';

import { useDashboardStats } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, CheckSquare, Users, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const items = [
  { key: 'total_projects', label: 'Projects', icon: FolderKanban, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
  { key: 'total_tasks', label: 'Total tasks', icon: CheckSquare, color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10' },
  { key: 'completed_tasks', label: 'Completed', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
  { key: 'overdue_tasks', label: 'Overdue', icon: AlertTriangle, color: 'text-red-600 bg-red-50 dark:bg-red-500/10' },
  { key: 'total_teams', label: 'Teams', icon: Users, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
  { key: 'tasks_due_soon', label: 'Due this week', icon: Clock, color: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10' },
] as const;

export function StatsCards() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <div key={item.key} className="rounded-xl border bg-card p-4">
            <Skeleton className="h-8 w-8 rounded-lg mb-3" />
            <Skeleton className="h-7 w-12 mb-1" />
            <Skeleton className="h-4 w-16" />
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
          <div key={item.key} className="rounded-xl border bg-card p-4">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${item.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}
