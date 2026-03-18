'use client';

import { useRecentActivity } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Edit, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const actionConfig: Record<string, { icon: React.ElementType; color: string }> = {
  created: { icon: PlusCircle, color: 'text-emerald-500' },
  updated: { icon: Edit, color: 'text-blue-500' },
  deleted: { icon: Trash2, color: 'text-red-400' },
  completed: { icon: CheckCircle2, color: 'text-violet-500' },
  commented: { icon: MessageSquare, color: 'text-amber-500' },
};

export function RecentActivity() {
  const { activities, isLoading } = useRecentActivity();

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b">
        <h2 className="font-semibold text-sm">Activity</h2>
      </div>
      <div className="divide-y">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-3">
              <Skeleton className="h-3.5 w-full mb-1.5" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))
        ) : !activities || activities.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </div>
        ) : (
          activities.slice(0, 8).map((a) => {
            const config = actionConfig[a.action] || actionConfig.updated;
            const Icon = config.icon;
            return (
              <div key={a.id} className="px-5 py-2.5 hover:bg-muted/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                  <div className="min-w-0">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{a.user?.full_name || 'Someone'}</span>
                      {' '}<span className="text-muted-foreground">{a.action}</span>{' '}
                      <span className="font-medium">{a.entity_name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
