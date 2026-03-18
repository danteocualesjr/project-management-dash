'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  GripVertical,
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface BoardTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  due_date: string;
  position: number;
}

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-slate-400' },
  { id: 'todo', label: 'To Do', color: 'bg-blue-500' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
  { id: 'review', label: 'Review', color: 'bg-violet-500' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500' },
];

const priorityConfig: Record<TaskPriority, { label: string; dot: string }> = {
  urgent: { label: 'Urgent', dot: 'bg-red-500' },
  high: { label: 'High', dot: 'bg-orange-500' },
  medium: { label: 'Medium', dot: 'bg-blue-400' },
  low: { label: 'Low', dot: 'bg-slate-300' },
};

const DEMO_ASSIGNEES = ['Alex Kim', 'Jordan Lee', 'Sam Park', 'Riley Chen', 'Casey Vu'];

const INITIAL_TASKS: BoardTask[] = [
  { id: '1', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment', status: 'done', priority: 'high', assignee: 'Alex Kim', due_date: '2026-03-15', position: 0 },
  { id: '2', title: 'Design system documentation', description: 'Document all design tokens, components, and patterns', status: 'review', priority: 'medium', assignee: 'Jordan Lee', due_date: '2026-03-20', position: 0 },
  { id: '3', title: 'User authentication flow', description: 'Implement login, register, and password reset with Supabase Auth', status: 'in_progress', priority: 'urgent', assignee: 'Alex Kim', due_date: '2026-03-18', position: 0 },
  { id: '4', title: 'Dashboard analytics widgets', description: 'Build completion rate, velocity, and workload charts', status: 'in_progress', priority: 'high', assignee: 'Sam Park', due_date: '2026-03-22', position: 1 },
  { id: '5', title: 'Team invitation system', description: 'Allow team admins to invite new members via email', status: 'todo', priority: 'medium', assignee: 'Riley Chen', due_date: '2026-03-25', position: 0 },
  { id: '6', title: 'Task comment threads', description: 'Add threaded comments to tasks with real-time updates', status: 'todo', priority: 'low', assignee: 'Casey Vu', due_date: '2026-03-28', position: 1 },
  { id: '7', title: 'File attachment support', description: 'Upload and attach files to tasks via Supabase Storage', status: 'backlog', priority: 'low', assignee: '', due_date: '', position: 0 },
  { id: '8', title: 'Mobile responsive layout', description: 'Ensure all pages work on tablet and mobile viewports', status: 'backlog', priority: 'medium', assignee: '', due_date: '', position: 1 },
  { id: '9', title: 'Role-based access control', description: 'Implement admin, member, and viewer roles per team', status: 'backlog', priority: 'high', assignee: 'Alex Kim', due_date: '', position: 2 },
  { id: '10', title: 'API rate limiting', description: 'Add rate limiting to protect against abuse', status: 'todo', priority: 'medium', assignee: 'Sam Park', due_date: '2026-03-30', position: 2 },
  { id: '11', title: 'Email notifications', description: 'Send email when assigned, mentioned, or due date approaching', status: 'backlog', priority: 'low', assignee: '', due_date: '', position: 3 },
  { id: '12', title: 'Sprint retrospective report', description: 'Auto-generate sprint summary with completed/carryover tasks', status: 'review', priority: 'medium', assignee: 'Jordan Lee', due_date: '2026-03-19', position: 1 },
];

let nextId = 13;

export default function BoardPage() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<BoardTask[]>(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<BoardTask | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('backlog');

  useEffect(() => { setMounted(true); }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, BoardTask[]> = {
      backlog: [], todo: [], in_progress: [], review: [], done: [],
    };
    tasks.forEach((t) => grouped[t.status].push(t));
    Object.values(grouped).forEach((arr) => arr.sort((a, b) => a.position - b.position));
    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === String(event.active.id));
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const isOverColumn = COLUMNS.some((c) => c.id === overId);

    if (isOverColumn) {
      const targetStatus = overId as TaskStatus;
      if (activeTask.status !== targetStatus) {
        setTasks((prev) => prev.map((t) =>
          t.id === activeId
            ? { ...t, status: targetStatus, position: tasksByStatus[targetStatus].length }
            : t
        ));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      setTasks((prev) => {
        const updated = [...prev];
        const activeIdx = updated.findIndex((t) => t.id === activeId);
        if (activeIdx === -1) return prev;

        updated[activeIdx] = {
          ...updated[activeIdx],
          status: overTask.status,
          position: overTask.position,
        };

        return recalcPositions(updated);
      });
    }
  };

  const recalcPositions = (taskList: BoardTask[]): BoardTask[] => {
    const grouped: Record<TaskStatus, BoardTask[]> = {
      backlog: [], todo: [], in_progress: [], review: [], done: [],
    };
    taskList.forEach((t) => grouped[t.status].push(t));
    const result: BoardTask[] = [];
    Object.values(grouped).forEach((arr) => {
      arr.sort((a, b) => a.position - b.position);
      arr.forEach((t, i) => result.push({ ...t, position: i }));
    });
    return result;
  };

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleEditTask = (task: BoardTask) => {
    setEditingTask(task);
    setDefaultStatus(task.status);
    setDialogOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => recalcPositions(prev.filter((t) => t.id !== taskId)));
  };

  const handleSaveTask = (data: Omit<BoardTask, 'id' | 'position'>) => {
    if (editingTask) {
      setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...data } : t));
    } else {
      const newTask: BoardTask = {
        ...data,
        id: String(nextId++),
        position: tasksByStatus[data.status].length,
      };
      setTasks((prev) => [...prev, newTask]);
    }
    setDialogOpen(false);
  };

  if (!mounted) {
    return (
      <div className="space-y-4">
        <PageHeader title="Kanban Board" description="Drag and drop tasks between columns to update status">
          <Button size="sm" onClick={() => handleAddTask('todo')}>
            <Plus className="mr-1.5 h-4 w-4" /> New task
          </Button>
        </PageHeader>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {COLUMNS.map((col) => (
            <div key={col.id} className="w-72 min-w-[272px] h-80 rounded-xl bg-muted/50 border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Kanban Board" description="Drag and drop tasks between columns to update status">
        <Button size="sm" onClick={() => handleAddTask('todo')}>
          <Plus className="mr-1.5 h-4 w-4" /> New task
        </Button>
      </PageHeader>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
          {COLUMNS.map((col) => (
            <SortableContext
              key={col.id}
              items={tasksByStatus[col.id].map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <BoardColumn
                column={col}
                tasks={tasksByStatus[col.id]}
                onTaskClick={handleEditTask}
                onAddTask={() => handleAddTask(col.id)}
                onDeleteTask={handleDeleteTask}
              />
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeTask && <BoardTaskCard task={activeTask} isDragging />}
        </DragOverlay>
      </DndContext>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSave={handleSaveTask}
      />
    </div>
  );
}

function BoardColumn({
  column,
  tasks,
  onTaskClick,
  onAddTask,
  onDeleteTask,
}: {
  column: { id: string; label: string; color: string };
  tasks: BoardTask[];
  onTaskClick: (task: BoardTask) => void;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className={cn(
      'flex flex-col w-72 min-w-[272px] rounded-xl bg-muted/50 border transition-colors',
      isOver && 'ring-2 ring-primary/30 bg-primary/5'
    )}>
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <div className={cn('h-2.5 w-2.5 rounded-full', column.color)} />
          <h3 className="font-medium text-sm">{column.label}</h3>
          <span className="text-[11px] text-muted-foreground bg-background border px-1.5 py-px rounded-full tabular-nums">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-260px)] overflow-y-auto">
        {tasks.map((task) => (
          <SortableTaskWrapper key={task.id} task={task} onClick={() => onTaskClick(task)} onDelete={() => onDeleteTask(task.id)} />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-24 rounded-lg border border-dashed text-xs text-muted-foreground">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTaskWrapper({ task, onClick, onDelete }: { task: BoardTask; onClick: () => void; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BoardTaskCard task={task} isDragging={isDragging} onClick={onClick} onDelete={onDelete} />
    </div>
  );
}

function BoardTaskCard({
  task,
  isDragging,
  onClick,
  onDelete,
}: {
  task: BoardTask;
  isDragging?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}) {
  const isDone = task.status === 'done';
  const pc = priorityConfig[task.priority];
  const initials = task.assignee
    ? task.assignee.split(' ').map((n) => n[0]).join('').toUpperCase()
    : null;

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-3 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-50 shadow-lg ring-2 ring-primary/20',
        isDone && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0" onClick={onClick}>
          <span className={cn('h-2 w-2 rounded-full mt-1.5 flex-shrink-0', pc.dot)} title={pc.label} />
          <span className={cn('text-sm font-medium leading-snug', isDone && 'line-through text-muted-foreground')}>
            {task.title}
          </span>
        </div>
        {onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
              style={{ opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={onClick}>
                <Edit className="mr-2 h-3.5 w-3.5" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {task.description && (
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 ml-4">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-2.5 ml-4">
        <div className="flex items-center gap-2">
          {task.due_date && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        {initials && (
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

function TaskFormDialog({
  open,
  onOpenChange,
  task,
  defaultStatus,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: BoardTask | null;
  defaultStatus: TaskStatus;
  onSave: (data: Omit<BoardTask, 'id' | 'position'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');

  const resetForm = useCallback(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setAssignee(task.assignee);
      setDueDate(task.due_date);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setAssignee('');
      setDueDate('');
    }
  }, [task, defaultStatus]);

  useState(() => { resetForm(); });

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) resetForm();
    onOpenChange(isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description, status, priority, assignee, due_date: dueDate });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit task' : 'New task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Implement user auth" autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the task..." rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as TaskStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COLUMNS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', c.color)} /> {c.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => v && setPriority(v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      <span className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', v.dot)} /> {v.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assignee} onValueChange={(v) => setAssignee(v ?? '')}>
                <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {DEMO_ASSIGNEES.map((name) => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">Due date</Label>
              <Input id="task-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!title.trim()}>{task ? 'Save changes' : 'Create task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
