'use client';

import { useDashboardStats } from '@/hooks/use-dashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban, CheckSquare, Users, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Projects', icon: FolderKanban },
  { label: 'Active Tasks', icon: CheckSquare },
  { label: 'Team Members', icon: Users },
  { label: 'Completion Rate', icon: TrendingUp },
];

export function StatsCards() {
  const { data, isLoading } = useDashboardStats();

  const values = data
    ? [
        data.totalProjects,
        data.activeTasks,
        data.teamMembers,
        data.completedTasks > 0
          ? Math.round((data.completedTasks / (data.completedTasks + data.activeTasks)) * 100)
          : 0,
      ]
    : [0, 0, 0, 0];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const value = values[index];
        const displayValue = index === 3 ? `${value}%` : value;

        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-3xl font-semibold">{displayValue}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
