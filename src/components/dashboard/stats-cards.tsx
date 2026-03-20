'use client';

import { useDashboardStats } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

const items = [
  {
    key: 'total_projects' as const,
    label: 'Active Projects',
    delta: '+2%',
    deltaType: 'positive' as const,
  },
  {
    key: 'total_tasks' as const,
    label: 'Tasks Pending',
    delta: '-5%',
    deltaType: 'negative' as const,
  },
  {
    key: 'total_teams' as const,
    label: 'Team Capacity',
    delta: '+0%',
    deltaType: 'neutral' as const,
    suffix: '%',
    override: 85,
  },
  {
    key: 'completed_tasks' as const,
    label: 'Avg. Velocity',
    delta: '+4%',
    deltaType: 'positive' as const,
    suffix: '%',
    override: 92,
    accent: true,
  },
];

const deltaStyles = {
  positive: 'text-primary bg-primary/10',
  negative: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
  neutral: 'text-muted-foreground bg-slate-100 dark:bg-slate-800',
};

export function StatsCards() {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.key} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-[0px_12px_32px_rgba(44,52,55,0.04)]">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const value = item.override ?? stats[item.key];
        return (
          <div
            key={item.key}
            className={`bg-white dark:bg-slate-900 p-6 rounded-xl shadow-[0px_12px_32px_rgba(44,52,55,0.04)] hover:-translate-y-0.5 transition-all ${
              item.accent ? 'border-l-4 border-primary' : ''
            }`}
          >
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase mb-3">
              {item.label}
            </p>
            <div className="flex items-end justify-between">
              <h3 className={`text-3xl font-bold font-headline ${item.accent ? 'text-primary' : ''}`}>
                {value}{item.suffix || ''}
              </h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${deltaStyles[item.deltaType]}`}>
                {item.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
