'use client';

import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={cn(
        'flex flex-col w-72 min-w-72 bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-[0px_12px_32px_rgba(44,52,55,0.04)] transition-colors',
        isOver && 'ring-2 ring-primary/30 bg-primary/5'
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className={cn('h-2.5 w-2.5 rounded-full', color)} />
          <h3 className="font-bold text-sm font-headline">{title}</h3>
          <span className="text-[11px] text-muted-foreground bg-white dark:bg-slate-800 shadow-sm px-1.5 py-px rounded-full tabular-nums font-bold">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
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
            <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-xs text-muted-foreground">
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
