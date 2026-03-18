'use client';

import { useTasksDueSoon } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2 } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { TASK_PRIORITY_CONFIG } from '@/types';

export function TasksDueSoon() {
  const { data: tasks, isLoading } = useTasksDueSoon();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tasks Due Soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const formatDueDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isPast(date) && !isToday(date)) return 'Overdue';
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tasks Due Soon</CardTitle>
      </CardHeader>
      <CardContent>
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date));
              const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
              
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {task.project && (
                        <span className="text-xs text-muted-foreground truncate">
                          {task.project.name}
                        </span>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {priorityConfig.label}
                      </Badge>
                    </div>
                  </div>

                  {task.due_date && (
                    <span className={cn(
                      'text-xs font-medium whitespace-nowrap',
                      isOverdue ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      {formatDueDate(task.due_date)}
                    </span>
                  )}

                  {task.assignee && (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={task.assignee.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {task.assignee.full_name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
