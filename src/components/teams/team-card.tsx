'use client';

import { useRouter } from 'next/navigation';
import { Team } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Users, FolderKanban } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

interface TeamCardProps {
  team: Team;
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

export function TeamCard({ team, onEdit, onDelete }: TeamCardProps) {
  const router = useRouter();

  return (
    <div
      className="rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => router.push(`${ROUTES.TEAMS}/${team.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
            style={{ backgroundColor: team.color || '#737373' }}
          >
            {team.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{team.name}</p>
            {team.description && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{team.description}</p>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(team); }}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(team); }}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {team.member_count ?? 0} members</span>
        <span className="flex items-center gap-1"><FolderKanban className="h-3 w-3" /> {team.project_count ?? 0} projects</span>
      </div>
    </div>
  );
}
