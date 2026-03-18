'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from './kanban-column';
import { TaskCard } from '../tasks/task-card';
import { TaskDialog } from '../tasks/task-dialog';
import { TASK_STATUS_CONFIG } from '@/types';
import type { Task, TaskStatus, User } from '@/types';

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  projectId: string;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskCreate: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
}

const COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];

export function KanbanBoard({
  tasks,
  users,
  projectId,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('backlog');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };

    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });

    Object.keys(grouped).forEach((status) => {
      grouped[status as TaskStatus].sort((a, b) => a.position - b.position);
    });

    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    
    if (COLUMNS.includes(overId as TaskStatus)) {
      if (activeTask.status !== overId) {
        const newPosition = tasksByStatus[overId as TaskStatus].length;
        onTaskUpdate(activeTask.id, {
          status: overId as TaskStatus,
          position: newPosition,
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const overTask = tasks.find((t) => t.id === overId);

    if (overTask && activeTask.id !== overTask.id) {
      const newStatus = overTask.status;
      const tasksInColumn = tasksByStatus[newStatus];
      const overIndex = tasksInColumn.findIndex((t) => t.id === overTask.id);
      
      onTaskUpdate(activeTask.id, {
        status: newStatus,
        position: overIndex,
      });
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleTaskSubmit = async (data: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigned_to?: string;
    due_date?: string;
  }) => {
    if (selectedTask) {
      await onTaskUpdate(selectedTask.id, data);
    } else {
      await onTaskCreate({
        ...data,
        project_id: projectId,
        created_by: '',
        position: tasksByStatus[data.status].length,
      } as Omit<Task, 'id' | 'created_at' | 'updated_at'>);
    }
  };

  const handleTaskDelete = async () => {
    if (selectedTask) {
      await onTaskDelete(selectedTask.id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((status) => (
          <SortableContext
            key={status}
            items={tasksByStatus[status].map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn
              id={status}
              title={TASK_STATUS_CONFIG[status].label}
              color={TASK_STATUS_CONFIG[status].color}
              tasks={tasksByStatus[status]}
              onTaskClick={handleTaskClick}
              onAddTask={() => handleAddTask(status)}
            />
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} isDragging />}
      </DragOverlay>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        users={users}
        defaultStatus={defaultStatus}
        onSubmit={handleTaskSubmit}
        onDelete={selectedTask ? handleTaskDelete : undefined}
      />
    </DndContext>
  );
}
