'use client';

import { useTasksDueSoon } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, Circle } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const priorityDot: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-blue-400',
  low: 'bg-slate-300',
};

export function TasksDueSoon() {
  const { tasks, isLoading } = useTasksDueSoon();

  const formatDue = (d: string) => {
    const date = parseISO(d);
    if (isPast(date) && !isToday(date)) return 'Overdue';
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b flex items-center justify-between">
        <h2 className="font-semibold text-sm">Upcoming tasks</h2>
        <span className="text-xs text-muted-foreground">{tasks?.length ?? 0} tasks</span>
      </div>
      <div className="divide-y">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1 max-w-[200px]" />
              <Skeleton className="h-4 w-14 ml-auto" />
            </div>
          ))
        ) : !tasks || tasks.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-sm font-medium">All caught up</p>
            <p className="text-xs text-muted-foreground mt-0.5">No upcoming tasks this week</p>
          </div>
        ) : (
          tasks.slice(0, 8).map((task) => {
            const overdue = task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date));
            return (
              <div key={task.id} className="px-5 py-2.5 flex items-center gap-3 hover:bg-muted/40 transition-colors">
                <Circle className="h-4 w-4 text-muted-foreground/30 flex-shrink-0" />
                <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', priorityDot[task.priority] || 'bg-slate-300')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{task.title}</p>
                  {task.project && (
                    <p className="text-xs text-muted-foreground truncate">{task.project.name}</p>
                  )}
                </div>
                {task.due_date && (
                  <span className={cn(
                    'text-xs tabular-nums flex-shrink-0',
                    overdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                  )}>
                    {formatDue(task.due_date)}
                  </span>
                )}
                {task.assignee && (
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={task.assignee.avatar_url || undefined} />
                    <AvatarFallback className="text-[9px]">
                      {task.assignee.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
