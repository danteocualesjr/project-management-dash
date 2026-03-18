'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KanbanBoard } from '@/components/projects/kanban-board';
import { useTasks } from '@/hooks/use-tasks';
import { useAllUsers } from '@/hooks/use-user';
import { ROUTES } from '@/lib/constants';
import { PROJECT_STATUS_CONFIG } from '@/types';
import type { Project, Task } from '@/types';
import { ArrowLeft, Settings } from 'lucide-react';

export default function ProjectKanbanPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const supabase = createClient();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { tasks, isLoading: tasksLoading, createTask, editTask, deleteTask } = useTasks({
    projectId,
  });
  const { users } = useAllUsers();

  const fetchProject = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      router.push(ROUTES.PROJECTS);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, supabase, router]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      await editTask(taskId, updates);
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskCreate = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await createTask({
        ...task,
        created_by: user.id,
      });
      toast.success('Task created');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (isLoading || tasksLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-muted rounded animate-pulse" />
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-72 h-96 bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const statusConfig = PROJECT_STATUS_CONFIG[project.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.PROJECTS}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              {project.team && (
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: project.team.color }}
                />
              )}
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge
                variant="secondary"
                className={`${statusConfig.color} text-white`}
              >
                {statusConfig.label}
              </Badge>
            </div>
            {project.description && (
              <p className="text-muted-foreground mt-1">{project.description}</p>
            )}
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={ROUTES.PROJECT(project.id) + '/settings'}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>

      <KanbanBoard
        tasks={tasks}
        users={users}
        projectId={projectId}
        onTaskUpdate={handleTaskUpdate}
        onTaskCreate={handleTaskCreate}
        onTaskDelete={handleTaskDelete}
      />
    </div>
  );
}
