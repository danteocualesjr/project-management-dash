'use client';

import { Task, TASK_PRIORITY_CONFIG } from '@/types';
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

const priorityDot: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-blue-400',
  low: 'bg-zinc-300',
};

export function TaskCard({ task, onStatusChange, onClick, isDragging }: TaskCardProps) {
  const isDone = task.status === 'done';
  const overdue = task.due_date && isPast(parseISO(task.due_date)) && !isDone;

  const formatDue = (d: string) => {
    const date = parseISO(d);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border bg-card px-3 py-2 hover:bg-muted/50 transition-colors',
        isDragging && 'opacity-50',
        isDone && 'opacity-50',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 cursor-grab flex-shrink-0" />
      
      <Checkbox
        checked={isDone}
        onCheckedChange={() => onStatusChange?.(task.id, isDone ? 'todo' : 'done')}
        onClick={(e) => e.stopPropagation()}
        className="flex-shrink-0"
      />

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className={cn('h-1.5 w-1.5 rounded-full flex-shrink-0', priorityDot[task.priority])} />
        <span className={cn('text-sm truncate', isDone && 'line-through text-muted-foreground')}>
          {task.title}
        </span>
      </div>

      {task.due_date && (
        <span className={cn(
          'text-xs flex-shrink-0 tabular-nums',
          overdue ? 'text-destructive' : 'text-muted-foreground'
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
}
