'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTeamMembers } from '@/hooks/use-teams';
import { useProjects } from '@/hooks/use-projects';
import { ROUTES } from '@/lib/constants';
import { PROJECT_STATUS_CONFIG } from '@/types';
import type { Team, Project } from '@/types';
import {
  ArrowLeft,
  Users,
  FolderKanban,
  Plus,
  Settings,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

export default function TeamPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;
  const supabase = createClient();

  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { members, isLoading: membersLoading } = useTeamMembers(teamId);
  const { projects, isLoading: projectsLoading } = useProjects(teamId);

  const fetchTeam = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      setTeam(data);
    } catch (error) {
      console.error('Failed to fetch team:', error);
      router.push(ROUTES.TEAMS);
    } finally {
      setIsLoading(false);
    }
  }, [teamId, supabase, router]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <Link href={ROUTES.TEAMS}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: team.color || '#6366f1' }}
          >
            {team.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{team.name}</h1>
            {team.description && (
              <p className="text-sm text-muted-foreground">{team.description}</p>
            )}
          </div>
        </div>
        <div className="ml-auto">
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.TEAM(team.id) + '/settings'}>
              <Settings className="mr-1.5 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-semibold">{members.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Projects</span>
                  <span className="font-semibold">{projects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Projects</span>
                  <span className="font-semibold">
                    {projects.filter((p) => p.status === 'in_progress').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Members */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Team Members</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={ROUTES.TEAM(team.id) + '/members'}>View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {membersLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="space-y-1">
                          <div className="h-4 w-24 bg-muted rounded" />
                          <div className="h-3 w-16 bg-muted rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No members yet</p>
                ) : (
                  <div className="space-y-3">
                    {members.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.user?.avatar_url} />
                          <AvatarFallback>
                            {member.user?.full_name
                              ? getInitials(member.user.full_name)
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {member.user?.full_name}
                          </p>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Projects</CardTitle>
              <Button size="sm" asChild>
                <Link href={ROUTES.PROJECTS + `?team=${team.id}&create=true`}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <EmptyState
                  icon={FolderKanban}
                  title="No projects yet"
                  description="Create your first project for this team."
                  action={
                    <Button size="sm" onClick={() => router.push(ROUTES.PROJECTS + `?team=${team.id}&create=true`)}>
                      <Plus className="mr-1.5 h-4 w-4" /> Create Project
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <ProjectRow key={project.id} project={project} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Projects</CardTitle>
              <Button size="sm" asChild>
                <Link href={ROUTES.PROJECTS + `?team=${team.id}&create=true`}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <EmptyState
                  icon={FolderKanban}
                  title="No projects yet"
                  description="Create your first project for this team."
                  action={
                    <Button size="sm" onClick={() => router.push(ROUTES.PROJECTS + `?team=${team.id}&create=true`)}>
                      <Plus className="mr-1.5 h-4 w-4" /> Create Project
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <ProjectRow key={project.id} project={project} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </CardHeader>
            <CardContent>
              {membersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="h-12 w-12 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 bg-muted rounded" />
                        <div className="h-3 w-24 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : members.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No members yet"
                  description="Add team members to start collaborating."
                  action={
                    <Button size="sm">
                      <Plus className="mr-1.5 h-4 w-4" /> Add Member
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-4 p-3 rounded-lg border"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.user?.avatar_url} />
                        <AvatarFallback>
                          {member.user?.full_name
                            ? getInitials(member.user.full_name)
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{member.user?.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.user?.email}
                        </p>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  const progress = project.task_count
    ? ((project.completed_task_count || 0) / project.task_count) * 100
    : 0;

  return (
    <Link href={ROUTES.PROJECT(project.id)}>
      <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{project.name}</h4>
            <Badge variant="secondary" className={`${statusConfig.color} text-white`}>
              {statusConfig.label}
            </Badge>
          </div>
          {project.description && (
            <p className="text-sm text-muted-foreground truncate mt-1">
              {project.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {project.start_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(project.start_date), 'MMM d, yyyy')}
              </span>
            )}
            <span>{project.task_count || 0} tasks</span>
          </div>
        </div>
        <div className="w-24">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </Link>
  );
}
