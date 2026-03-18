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
    if (searchParams.get('create') === 'true') setDialogOpen(true);
  }, [searchParams]);

  const filtered = teams.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleCreate = () => { setSelectedTeam(null); setDialogOpen(true); };
  const handleEdit = (team: Team) => { setSelectedTeam(team); setDialogOpen(true); };
  const handleDelete = (team: Team) => { setSelectedTeam(team); setDeleteDialogOpen(true); };

  const handleSubmit = async (data: { name: string; description?: string; color: string }) => {
    try {
      if (selectedTeam) { await editTeam(selectedTeam.id, data); toast.success('Team updated'); }
      else { await createTeam(data); toast.success('Team created'); }
    } catch { toast.error('Something went wrong'); }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTeam) return;
    try { await deleteTeam(selectedTeam.id); toast.success('Team deleted'); }
    catch { toast.error('Failed to delete team'); }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Teams" description="Manage your organization's teams" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Teams" description="Manage your organization's teams">
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> New team
        </Button>
      </PageHeader>

      {teams.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search teams..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-8 pl-8 text-sm" />
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} team{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {teams.length === 0 ? (
        <EmptyState icon={Users} title="No teams yet" description="Create your first team to get started."
          action={<Button size="sm" onClick={handleCreate}><Plus className="mr-1.5 h-4 w-4" /> New team</Button>} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results" description="Try a different search term." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => <TeamCard key={team.id} team={team} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>
      )}

      <TeamDialog open={dialogOpen} onOpenChange={setDialogOpen} team={selectedTeam} onSubmit={handleSubmit} />
      <DeleteTeamDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} team={selectedTeam} onConfirm={handleConfirmDelete} />
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <PageHeader title="Teams" description="Manage your organization's teams" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      </div>
    }>
      <TeamsContent />
    </Suspense>
  );
}
