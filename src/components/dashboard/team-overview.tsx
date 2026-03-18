'use client';

import { useTeams } from '@/hooks/use-teams';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Users, FolderKanban, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export function TeamOverview() {
  const router = useRouter();
  const { teams, isLoading } = useTeams();

  return (
    <div className="rounded-lg border bg-card">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h2 className="text-sm font-medium">Teams</h2>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground"
          onClick={() => router.push(ROUTES.TEAMS)}
        >
          View all <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      {isLoading ? (
        <div className="p-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : !teams || teams.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <Users className="h-6 w-6 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">No teams yet</p>
        </div>
      ) : (
        <div className="divide-y">
          {teams.slice(0, 6).map((team) => (
            <div
              key={team.id}
              className="px-4 py-2.5 flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => router.push(`${ROUTES.TEAMS}/${team.id}`)}
            >
              <div
                className="h-8 w-8 rounded flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                style={{ backgroundColor: team.color || '#737373' }}
              >
                {team.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{team.name}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {team.member_count ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <FolderKanban className="h-3 w-3" />
                  {team.project_count ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
