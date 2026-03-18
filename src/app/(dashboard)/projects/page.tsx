'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectDialog } from '@/components/projects/project-dialog';
import { DeleteTeamDialog } from '@/components/teams/delete-team-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProjects } from '@/hooks/use-projects';
import { useAppStore } from '@/store/use-app-store';
import { PROJECT_STATUS_CONFIG } from '@/types';
import type { Project, ProjectStatus } from '@/types';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectsContent() {
  const searchParams = useSearchParams();
  const { teams } = useAppStore();
  const { projects, isLoading, createProject, editProject, deleteProject } = useProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [defaultTeamId, setDefaultTeamId] = useState<string | undefined>();

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      const teamId = searchParams.get('team');
      if (teamId) setDefaultTeamId(teamId);
      setDialogOpen(true);
    }
  }, [searchParams]);

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchTeam = teamFilter === 'all' || p.team_id === teamFilter;
    return matchSearch && matchStatus && matchTeam;
  });

  const handleCreate = () => { setSelectedProject(null); setDefaultTeamId(undefined); setDialogOpen(true); };
  const handleEdit = (p: Project) => { setSelectedProject(p); setDialogOpen(true); };
  const handleDelete = (p: Project) => { setSelectedProject(p); setDeleteDialogOpen(true); };

  const handleSubmit = async (data: { name: string; description?: string; team_id: string; status: ProjectStatus; start_date?: string; end_date?: string }) => {
    try {
      if (selectedProject) { await editProject(selectedProject.id, data); toast.success('Project updated'); }
      else { await createProject(data as Project); toast.success('Project created'); }
    } catch { toast.error('Something went wrong'); }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;
    try { await deleteProject(selectedProject.id); toast.success('Project deleted'); }
    catch { toast.error('Failed to delete project'); }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Projects" description="Manage and track your team projects" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Projects" description="Manage and track your team projects">
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-1.5 h-4 w-4" /> New project
        </Button>
      </PageHeader>

      {projects.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative sm:w-56">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-8 pl-8 text-sm" />
            </div>
            <Select value={teamFilter} onValueChange={(v) => setTeamFilter(v || 'all')}>
              <SelectTrigger className="h-8 w-[130px] text-xs">
                <SelectValue placeholder="All teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All teams</SelectItem>
                {teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as ProjectStatus | 'all')}>
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs h-6 px-2.5">All</TabsTrigger>
              {Object.entries(PROJECT_STATUS_CONFIG).map(([v, c]) => (
                <TabsTrigger key={v} value={v} className="text-xs h-6 px-2.5">{c.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to get started."
          action={<Button size="sm" onClick={handleCreate}><Plus className="mr-1.5 h-4 w-4" /> New project</Button>} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results" description="Try different filters or search term." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} onEdit={handleEdit} onDelete={handleDelete} />)}
        </div>
      )}

      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={selectedProject} teams={teams} defaultTeamId={defaultTeamId} onSubmit={handleSubmit} />
      <DeleteTeamDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} team={selectedProject as any} onConfirm={handleConfirmDelete} />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <PageHeader title="Projects" description="Manage and track your team projects" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
