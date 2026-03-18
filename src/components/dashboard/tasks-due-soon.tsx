'use client';

import { useTasksDueSoon } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { TASK_PRIORITY_CONFIG } from '@/types';

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
    <div className="rounded-lg border bg-card">
      <div className="px-4 py-3 border-b">
        <h2 className="text-sm font-medium">Upcoming tasks</h2>
      </div>
      <div className="divide-y">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))
        ) : !tasks || tasks.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <CheckCircle2 className="h-6 w-6 mx-auto text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming tasks</p>
          </div>
        ) : (
          tasks.slice(0, 8).map((task) => {
            const overdue = task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date));
            const priority = TASK_PRIORITY_CONFIG[task.priority];
            return (
              <div key={task.id} className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.project && (
                      <span className="text-xs text-muted-foreground truncate">{task.project.name}</span>
                    )}
                    <span className={cn(
                      'inline-block h-1.5 w-1.5 rounded-full flex-shrink-0',
                      priority.color
                    )} />
                  </div>
                </div>
                {task.due_date && (
                  <span className={cn(
                    'text-xs flex-shrink-0 tabular-nums',
                    overdue ? 'text-destructive font-medium' : 'text-muted-foreground'
                  )}>
                    {formatDue(task.due_date)}
                  </span>
                )}
                {task.assignee && (
                  <Avatar className="h-5 w-5 flex-shrink-0">
                    <AvatarImage src={task.assignee.avatar_url || undefined} />
                    <AvatarFallback className="text-[9px] bg-muted">
                      {task.assignee.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
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
