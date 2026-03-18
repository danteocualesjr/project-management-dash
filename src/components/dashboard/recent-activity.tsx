'use client';

import { useRecentActivity } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity() {
  const { activities, isLoading } = useRecentActivity();

  return (
    <div className="rounded-lg border bg-card">
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-medium">Activity</h2>
      </div>
      <div className="divide-y">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3">
              <Skeleton className="h-3 w-full mb-1.5" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : !activities || activities.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </div>
        ) : (
          activities.slice(0, 10).map((a) => (
            <div key={a.id} className="px-4 py-2.5 hover:bg-muted/50 transition-colors">
              <p className="text-sm">
                <span className="font-medium">{a.user?.full_name || 'Someone'}</span>
                {' '}<span className="text-muted-foreground">{a.action}</span>{' '}
                <span className="font-medium">{a.entity_name}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
