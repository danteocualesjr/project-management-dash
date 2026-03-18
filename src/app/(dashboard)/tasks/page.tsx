'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import { Search, CheckSquare, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function MyTasksPage() {
  const supabase = createClient();
  const { tasks, isLoading, refetch } = useMyTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

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
      await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);
      toast.success(newStatus === 'done' ? 'Task completed!' : 'Task reopened');
      refetch();
    } catch (error) {
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

  const getDueDateColor = (date: string) => {
    const d = new Date(date);
    if (isPast(d) && !isToday(d)) return 'text-destructive bg-destructive/10';
    if (isToday(d)) return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
    return 'text-muted-foreground bg-muted';
  };

  const todayCount = tasks.filter((t) => t.due_date && isToday(new Date(t.due_date))).length;
  const overdueCount = tasks.filter((t) => t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date))).length;
  const upcomingCount = tasks.filter((t) => t.due_date && !isPast(new Date(t.due_date))).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Tasks" description="Tasks assigned to you" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Tasks" description="Tasks assigned to you" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="today" className="gap-2">
              Today
              {todayCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {todayCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="overdue" className="gap-2">
              Overdue
              {overdueCount > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {overdueCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingCount})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={priorityFilter}
              onValueChange={(v) => setPriorityFilter(v as TaskPriority | 'all')}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {Object.entries(TASK_PRIORITY_CONFIG).map(([value, config]) => (
                  <SelectItem key={value} value={value}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {tasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks assigned to you"
              description="When tasks are assigned to you, they'll appear here."
            />
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No tasks found"
              description="Try adjusting your filters or search query."
            />
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={() => handleToggleComplete(task)}
                  getDueDateLabel={getDueDateLabel}
                  getDueDateColor={getDueDateColor}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TaskRow({
  task,
  onToggleComplete,
  getDueDateLabel,
  getDueDateColor,
}: {
  task: Task;
  onToggleComplete: () => void;
  getDueDateLabel: (date: string) => string;
  getDueDateColor: (date: string) => string;
}) {
  const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
  const statusConfig = TASK_STATUS_CONFIG[task.status];

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="pt-0.5">
            <Checkbox
              checked={task.status === 'done'}
              onCheckedChange={onToggleComplete}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={ROUTES.PROJECT(task.project_id)}
                className="font-medium hover:text-primary transition-colors"
              >
                {task.title}
              </Link>
              <Badge
                variant="outline"
                className={cn(priorityConfig.color, 'text-white border-0')}
              >
                {priorityConfig.label}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <div className={cn('h-2 w-2 rounded-full mr-1', statusConfig.color)} />
                {statusConfig.label}
              </Badge>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {task.project && (
                <Link
                  href={ROUTES.PROJECT(task.project_id)}
                  className="hover:text-foreground flex items-center gap-1"
                >
                  {task.project.team && (
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: task.project.team.color }}
                    />
                  )}
                  {task.project.name}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </div>
          {task.due_date && (
            <Badge
              variant="secondary"
              className={cn('shrink-0', getDueDateColor(task.due_date))}
            >
              <Calendar className="h-3 w-3 mr-1" />
              {getDueDateLabel(task.due_date)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
