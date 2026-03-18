'use client';

import { useTeams } from '@/hooks/use-teams';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, FolderKanban, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export function TeamOverview() {
  const router = useRouter();
  const { data: teams, isLoading } = useTeams();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Teams</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push(ROUTES.TEAMS)}
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {!teams || teams.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No teams yet</p>
            <Button size="sm" onClick={() => router.push(ROUTES.TEAMS)}>
              Create team
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.slice(0, 6).map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => router.push(`${ROUTES.TEAMS}/${team.id}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: team.color || '#6366f1' }}
                  >
                    {team.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{team.name}</p>
                    <p className="text-xs text-muted-foreground">{team.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {team.members_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderKanban className="h-3 w-3" />
                    {team.projects_count || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
