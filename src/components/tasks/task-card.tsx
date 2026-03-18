'use client';

import { Task, TASK_PRIORITY_CONFIG } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: string) => void;
  onClick?: () => void;
  isDragging?: boolean;
}

const priorityVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  urgent: 'destructive',
  high: 'default',
  medium: 'secondary',
  low: 'outline',
};

export function TaskCard({ task, onStatusChange, onClick, isDragging }: TaskCardProps) {
  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
  const isDone = task.status === 'done';

  const formatDueDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && !isDone;

  return (
    <Card
      className={cn(
        'cursor-pointer hover:bg-muted/50 transition-colors',
        isDragging && 'opacity-50',
        isDone && 'opacity-60'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 cursor-grab flex-shrink-0" />
          
          <Checkbox
            checked={isDone}
            onCheckedChange={() => {
              if (onStatusChange) {
                onStatusChange(task.id, isDone ? 'todo' : 'done');
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="mt-0.5"
          />

          <div className="flex-1 min-w-0">
            <p className={cn(
              'text-sm font-medium',
              isDone && 'line-through text-muted-foreground'
            )}>
              {task.title}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant={priorityVariants[task.priority]} className="text-xs">
                {priorityConfig.label}
              </Badge>
              
              {task.due_date && (
                <span className={cn(
                  'flex items-center gap-1 text-xs',
                  isOverdue ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  <Calendar className="h-3 w-3" />
                  {formatDueDate(task.due_date)}
                </span>
              )}
            </div>
          </div>

          {task.assignee && (
            <Avatar className="h-6 w-6 flex-shrink-0">
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
      </CardContent>
    </Card>
  );
}
