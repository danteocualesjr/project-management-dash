'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { TeamCard } from '@/components/teams/team-card';
import { TeamDialog } from '@/components/teams/team-dialog';
import { DeleteTeamDialog } from '@/components/teams/delete-team-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeams } from '@/hooks/use-teams';
import type { Team } from '@/types';
import { Plus, Search, Users } from 'lucide-react';

function TeamsContent() {
  const searchParams = useSearchParams();
  const { teams, isLoading, createTeam, editTeam, deleteTeam } = useTeams();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setDialogOpen(true);
    }
  }, [searchParams]);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedTeam(null);
    setDialogOpen(true);
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setDialogOpen(true);
  };

  const handleDelete = (team: Team) => {
    setSelectedTeam(team);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: { name: string; description?: string; color: string }) => {
    try {
      if (selectedTeam) {
        await editTeam(selectedTeam.id, data);
        toast.success('Team updated successfully');
      } else {
        await createTeam(data);
        toast.success('Team created successfully');
      }
    } catch (error) {
      toast.error(selectedTeam ? 'Failed to update team' : 'Failed to create team');
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTeam) return;
    try {
      await deleteTeam(selectedTeam.id);
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error('Failed to delete team');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Teams" description="Manage your organization's teams" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Teams" description="Manage your organization's teams">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </PageHeader>

      {teams.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {teams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teams yet"
          description="Create your first team to start organizing projects and collaborating with your colleagues."
          action={
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          }
        />
      ) : filteredTeams.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No teams found"
          description="Try adjusting your search query to find what you're looking for."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TeamDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        team={selectedTeam}
        onSubmit={handleSubmit}
      />

      <DeleteTeamDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        team={selectedTeam}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <PageHeader title="Teams" description="Manage your organization's teams" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    }>
      <TeamsContent />
    </Suspense>
  );
}
