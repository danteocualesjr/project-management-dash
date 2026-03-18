'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useMyTasks } from '@/hooks/use-tasks';
import { ROUTES } from '@/lib/constants';
import { TASK_PRIORITY_CONFIG, TASK_STATUS_CONFIG } from '@/types';
import type { Task, TaskPriority, TaskStatus } from '@/types';
import { Search, CheckSquare, Calendar, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const priorityDot: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-blue-400',
  low: 'bg-slate-300',
};

export default function MyTasksPage() {
  const supabase = createClient();
  const { tasks, isLoading, refetch } = useMyTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    if (activeTab === 'today') {
      return matchesSearch && matchesPriority && task.due_date && isToday(new Date(task.due_date));
    }
    if (activeTab === 'overdue') {
      return matchesSearch && matchesPriority && task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));
    }
    if (activeTab === 'upcoming') {
      return matchesSearch && matchesPriority && task.due_date && !isPast(new Date(task.due_date));
    }
    return matchesSearch && matchesPriority;
  });

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
      await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
      toast.success(newStatus === 'done' ? 'Task completed!' : 'Task reopened');
      refetch();
    } catch {
      toast.error('Failed to update task');
    }
  };

  const getDueDateLabel = (date: string) => {
    const d = new Date(date);
    if (isPast(d) && !isToday(d)) return 'Overdue';
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'MMM d');
  };

  const todayCount = tasks.filter((t) => t.due_date && isToday(new Date(t.due_date))).length;
  const overdueCount = tasks.filter((t) => t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date))).length;
  const upcomingCount = tasks.filter((t) => t.due_date && !isPast(new Date(t.due_date))).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Tasks" description="Tasks assigned to you" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-muted/50 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="My Tasks" description="Tasks assigned to you" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-xs h-6 px-2.5">All ({tasks.length})</TabsTrigger>
            <TabsTrigger value="today" className="text-xs h-6 px-2.5">Today {todayCount > 0 && `(${todayCount})`}</TabsTrigger>
            <TabsTrigger value="overdue" className="text-xs h-6 px-2.5">
              Overdue {overdueCount > 0 && <span className="ml-1 text-destructive">({overdueCount})</span>}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs h-6 px-2.5">Upcoming ({upcomingCount})</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative sm:w-56">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-8 pl-8 text-sm" />
            </div>
            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as TaskPriority | 'all')}>
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                {Object.entries(TASK_PRIORITY_CONFIG).map(([value, config]) => (
                  <SelectItem key={value} value={value}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          {tasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="No tasks assigned to you" description="When tasks are assigned to you, they'll appear here." />
          ) : filteredTasks.length === 0 ? (
            <EmptyState icon={Search} title="No tasks found" description="Try adjusting your filters or search query." />
          ) : (
            <div className="rounded-xl border bg-card overflow-hidden divide-y">
              {filteredTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggleComplete={() => handleToggleComplete(task)} getDueDateLabel={getDueDateLabel} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TaskRow({ task, onToggleComplete, getDueDateLabel }: {
  task: Task;
  onToggleComplete: () => void;
  getDueDateLabel: (date: string) => string;
}) {
  const isDone = task.status === 'done';
  const overdue = task.due_date && isPast(new Date(task.due_date)) && !isToday(new Date(task.due_date));

  return (
    <div className={cn('flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors', isDone && 'opacity-60')}>
      <Checkbox checked={isDone} onCheckedChange={onToggleComplete} className="flex-shrink-0" />
      <span className={cn('h-2 w-2 rounded-full flex-shrink-0', priorityDot[task.priority] || 'bg-slate-300')} title={TASK_PRIORITY_CONFIG[task.priority]?.label} />
      <div className="flex-1 min-w-0">
        <Link href={ROUTES.PROJECT(task.project_id)} className={cn('text-sm hover:text-primary transition-colors', isDone && 'line-through text-muted-foreground')}>
          {task.title}
        </Link>
        {task.project && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {task.project.name}
            {task.project.team && <span> / {task.project.team.name}</span>}
          </p>
        )}
      </div>
      {task.due_date && (
        <span className={cn('text-xs tabular-nums flex-shrink-0', overdue ? 'text-destructive font-medium' : 'text-muted-foreground')}>
          <Calendar className="inline h-3 w-3 mr-1" />
          {getDueDateLabel(task.due_date)}
        </span>
      )}
    </div>
  );
}
