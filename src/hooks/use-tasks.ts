'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/use-app-store';
import type { Task, TaskStatus } from '@/types';

interface UseTasksOptions {
  projectId?: string;
  assignedTo?: string;
  status?: TaskStatus;
}

export function useTasks(options: UseTasksOptions = {}) {
  const supabase = createClient();
  const { tasks, setTasks, addTask, updateTask, removeTask, moveTask } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*),
          assignee:profiles!tasks_assigned_to_fkey(*),
          creator:profiles!tasks_created_by_fkey(*)
        `)
        .order('position')
        .order('created_at', { ascending: false });

      if (options.projectId) {
        query = query.eq('project_id', options.projectId);
      }

      if (options.assignedTo) {
        query = query.eq('assigned_to', options.assignedTo);
      }

      if (options.status) {
        query = query.eq('status', options.status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, setTasks, options.projectId, options.assignedTo, options.status]);

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select(`
          *,
          project:projects(*),
          assignee:profiles!tasks_assigned_to_fkey(*),
          creator:profiles!tasks_created_by_fkey(*)
        `)
        .single();

      if (error) throw error;

      addTask(data);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create task');
    }
  };

  const editTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          project:projects(*),
          assignee:profiles!tasks_assigned_to_fkey(*),
          creator:profiles!tasks_created_by_fkey(*)
        `)
        .single();

      if (error) throw error;

      updateTask(data);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      removeTask(id);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete task');
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus, position: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status, position })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      moveTask(id, status, position);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update task status');
    }
  };

  const reorderTasks = async (taskId: string, newStatus: TaskStatus, newPosition: number) => {
    try {
      moveTask(taskId, newStatus, newPosition);

      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, position: newPosition })
        .eq('id', taskId);

      if (error) {
        fetchTasks();
        throw error;
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to reorder tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
    createTask,
    editTask,
    deleteTask,
    updateTaskStatus,
    reorderTasks,
  };
}

export function useMyTasks() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*, team:teams(*)),
          assignee:profiles!tasks_assigned_to_fkey(*),
          creator:profiles!tasks_created_by_fkey(*)
        `)
        .eq('assigned_to', user.id)
        .neq('status', 'done')
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('priority', { ascending: false });

      if (fetchError) throw fetchError;

      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchMyTasks,
  };
}
