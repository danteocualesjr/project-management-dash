'use client';

import { useDashboardStats } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, Clock, Users, Zap } from 'lucide-react';

const items = [
  {
    key: 'total_projects' as const,
    label: 'Active Projects',
    icon: FolderKanban,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    delta: '+2%',
    deltaColor: 'text-emerald-500',
  },
  {
    key: 'total_tasks' as const,
    label: 'Tasks Pending',
    icon: Clock,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    delta: '-5%',
    deltaColor: 'text-rose-500',
  },
  {
    key: 'total_teams' as const,
    label: 'Team Capacity',
    icon: Users,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    delta: '+0%',
    deltaColor: 'text-emerald-500',
    suffix: '%',
    override: 85,
  },
  {
    key: 'completed_tasks' as const,
    label: 'Avg. Velocity',
    icon: Zap,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    delta: '+4%',
    deltaColor: 'text-emerald-500',
    suffix: '%',
    override: 92,
  },
];

export function StatsCards() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.key} className="bg-card rounded-xl border p-6">
            <Skeleton className="h-9 w-9 rounded-lg mb-4" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const Icon = item.icon;
        const value = item.override ?? stats[item.key];
        return (
          <div key={item.key} className="bg-card rounded-xl border p-6">
            <div className="flex justify-between items-start mb-4">
              <span className={`p-2 rounded-lg ${item.iconBg}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className={`text-xs font-bold ${item.deltaColor}`}>
                {item.delta}
              </span>
            </div>
            <p className="text-muted-foreground text-sm font-medium">{item.label}</p>
            <p className="text-2xl font-bold mt-1">
              {value}{item.suffix || ''}
            </p>
          </div>
        );
      })}
    </div>
  );
}
