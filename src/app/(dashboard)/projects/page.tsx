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

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || project.status === statusFilter;
    const matchesTeam = teamFilter === 'all' || project.team_id === teamFilter;
    return matchesSearch && matchesStatus && matchesTeam;
  });

  const handleCreate = () => {
    setSelectedProject(null);
    setDefaultTeamId(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (data: {
    name: string;
    description?: string;
    team_id: string;
    status: ProjectStatus;
    start_date?: string;
    end_date?: string;
  }) => {
    try {
      if (selectedProject) {
        await editProject(selectedProject.id, data);
        toast.success('Project updated successfully');
      } else {
        await createProject(data as Project);
        toast.success('Project created successfully');
      }
    } catch (error) {
      toast.error(
        selectedProject ? 'Failed to update project' : 'Failed to create project'
      );
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;
    try {
      await deleteProject(selectedProject.id);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Projects" description="Manage and track your team projects" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Manage and track your team projects">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </PageHeader>

      {projects.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={teamFilter} onValueChange={(value) => setTeamFilter(value || 'all')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ProjectStatus | 'all')}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {Object.entries(PROJECT_STATUS_CONFIG).map(([value, config]) => (
                <TabsTrigger key={value} value={value}>
                  {config.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start tracking tasks and progress."
          action={
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          }
        />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No projects found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={selectedProject}
        teams={teams}
        defaultTeamId={defaultTeamId}
        onSubmit={handleSubmit}
      />

      <DeleteTeamDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        team={selectedProject as any}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <PageHeader title="Projects" description="Manage and track your team projects" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    }>
      <ProjectsContent />
    </Suspense>
  );
}
