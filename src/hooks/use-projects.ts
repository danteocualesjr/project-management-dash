'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/use-app-store';
import type { Project } from '@/types';

export function useProjects(teamId?: string) {
  const supabase = createClient();
  const { projects, setProjects, addProject, updateProject, removeProject } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('projects')
        .select(`
          *,
          team:teams(*),
          tasks(count)
        `)
        .order('created_at', { ascending: false });

      if (teamId) {
        query = query.eq('team_id', teamId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const projectsWithCounts = data?.map(project => ({
        ...project,
        task_count: project.tasks?.[0]?.count || 0,
      })) || [];

      setProjects(projectsWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, setProjects, teamId]);

  const createProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select(`
          *,
          team:teams(*)
        `)
        .single();

      if (error) throw error;

      addProject({ ...data, task_count: 0 });
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create project');
    }
  };

  const editProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          team:teams(*)
        `)
        .single();

      if (error) throw error;

      updateProject(data);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      removeProject(id);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
    createProject,
    editProject,
    deleteProject,
  };
}

export function useProject(projectId: string) {
  const supabase = createClient();
  const { currentProject, setCurrentProject } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select(`
          *,
          team:teams(*)
        `)
        .eq('id', projectId)
        .single();

      if (fetchError) throw fetchError;

      setCurrentProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, supabase, setCurrentProject]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project: currentProject,
    isLoading,
    error,
    refetch: fetchProject,
  };
}
