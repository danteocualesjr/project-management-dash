'use client';

import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TaskCard } from '../tasks/task-card';
import type { Task } from '@/types';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
}

export function KanbanColumn({
  id,
  title,
  color,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      className={cn(
        'flex flex-col w-72 min-w-72 bg-muted/50 rounded-lg',
        isOver && 'ring-2 ring-primary/30'
      )}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className={cn('h-3 w-3 rounded-full', color)} />
          <h3 className="font-medium text-sm">{title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-2" ref={setNodeRef}>
        <div className="space-y-2 min-h-[200px]">
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              Drop tasks here
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface SortableTaskProps {
  task: Task;
  onClick: () => void;
}

function SortableTask({ task, onClick }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} isDragging={isDragging} />
    </div>
  );
}
