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
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b flex items-center justify-between">
        <h2 className="font-semibold text-sm">Teams</h2>
        <button
          onClick={() => router.push(ROUTES.TEAMS)}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
        >
          View all <ArrowRight className="h-3 w-3" />
        </button>
      </div>
      {isLoading ? (
        <div className="divide-y">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 flex-1 max-w-[120px]" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      ) : !teams || teams.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <Users className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
          <p className="text-sm text-muted-foreground">No teams yet</p>
          <Button size="sm" className="mt-3" onClick={() => router.push(ROUTES.TEAMS)}>Create team</Button>
        </div>
      ) : (
        <div className="divide-y">
          {teams.slice(0, 6).map((team) => (
            <div
              key={team.id}
              className="px-5 py-2.5 flex items-center gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => router.push(`${ROUTES.TEAMS}/${team.id}`)}
            >
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ backgroundColor: team.color || '#6366f1' }}
              >
                {team.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{team.name}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums flex-shrink-0">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {team.member_count ?? 0}
                </span>
                <span className="flex items-center gap-1">
                  <FolderKanban className="h-3 w-3" /> {team.project_count ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
