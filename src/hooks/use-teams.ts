'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/use-app-store';
import type { Team, TeamMember } from '@/types';

export function useTeams() {
  const supabase = createClient();
  const { teams, setTeams, addTeam, updateTeam, removeTeam } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('teams')
        .select(`
          *,
          team_members(count),
          projects(count)
        `)
        .order('name');

      if (fetchError) throw fetchError;

      const teamsWithCounts = data?.map(team => ({
        ...team,
        member_count: team.team_members?.[0]?.count || 0,
        project_count: team.projects?.[0]?.count || 0,
      })) || [];

      setTeams(teamsWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      setIsLoading(false);
    }
  }, [supabase, setTeams]);

  const createTeam = async (team: Omit<Team, 'id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('teams')
        .insert(team)
        .select()
        .single();

      if (error) throw error;

      // Add current user as team admin
      await supabase
        .from('team_members')
        .insert({
          team_id: data.id,
          user_id: user.id,
          role: 'admin',
        });

      addTeam({ ...data, member_count: 1, project_count: 0 });
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create team');
    }
  };

  const editTeam = async (id: string, updates: Partial<Team>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      updateTeam(data);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update team');
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) throw error;

      removeTeam(id);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete team');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    isLoading,
    error,
    refetch: fetchTeams,
    createTeam,
    editTeam,
    deleteTeam,
  };
}

export function useTeamMembers(teamId: string) {
  const supabase = createClient();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!teamId) return;
    
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('team_id', teamId)
        .order('joined_at');

      if (fetchError) throw fetchError;

      setMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team members');
    } finally {
      setIsLoading(false);
    }
  }, [teamId, supabase]);

  const addMember = async (userId: string, role: TeamMember['role'] = 'member') => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role,
        })
        .select(`
          *,
          user:profiles(*)
        `)
        .single();

      if (error) throw error;

      setMembers(prev => [...prev, data]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add team member');
    }
  };

  const updateMemberRole = async (memberId: string, role: TeamMember['role']) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update({ role })
        .eq('id', memberId)
        .select(`
          *,
          user:profiles(*)
        `)
        .single();

      if (error) throw error;

      setMembers(prev => prev.map(m => m.id === memberId ? data : m));
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update member role');
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to remove team member');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    isLoading,
    error,
    refetch: fetchMembers,
    addMember,
    updateMemberRole,
    removeMember,
  };
}
