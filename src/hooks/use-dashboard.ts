'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { DashboardStats, Activity, Task } from '@/types';

export function useDashboardStats() {
  const supabase = createClient();
  const [stats, setStats] = useState<DashboardStats>({
    total_teams: 0,
    total_projects: 0,
    total_tasks: 0,
    completed_tasks: 0,
    overdue_tasks: 0,
    tasks_due_soon: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const [
        teamsResult,
        projectsResult,
        tasksResult,
        completedResult,
        overdueResult,
        dueSoonResult,
      ] = await Promise.all([
        supabase.from('teams').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('tasks').select('*', { count: 'exact', head: true }),
        supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'done'),
        supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .lt('due_date', today)
          .neq('status', 'done'),
        supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .gte('due_date', today)
          .lte('due_date', nextWeek)
          .neq('status', 'done'),
      ]);

      setStats({
        total_teams: teamsResult.count || 0,
        total_projects: projectsResult.count || 0,
        total_tasks: tasksResult.count || 0,
        completed_tasks: completedResult.count || 0,
        overdue_tasks: overdueResult.count || 0,
        tasks_due_soon: dueSoonResult.count || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

export function useRecentActivity() {
  const supabase = createClient();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('activities')
        .select(`
          *,
          user:profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

      setActivities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { activities, isLoading, error, refetch: fetchActivities };
}

export function useTasksDueSoon() {
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*),
          assignee:profiles!tasks_assigned_to_fkey(*)
        `)
        .lte('due_date', nextWeek)
        .neq('status', 'done')
        .order('due_date', { ascending: true })
        .limit(10);

      if (fetchError) throw fetchError;

      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, isLoading, error, refetch: fetchTasks };
}
