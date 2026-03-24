'use client';

import { useRouter } from 'next/navigation';
import { Team } from '@/types';
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
      className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-[0px_12px_32px_rgba(44,52,55,0.04)] hover:-translate-y-0.5 hover:shadow-[0px_16px_40px_rgba(44,52,55,0.08)] transition-all cursor-pointer"
      onClick={() => router.push(`${ROUTES.TEAMS}/${team.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
            style={{ backgroundColor: team.color || '#6366f1' }}
          >
            {team.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate font-headline">{team.name}</p>
            {team.description && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{team.description}</p>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
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
      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1.5 font-medium"><Users className="h-3.5 w-3.5" /> {team.member_count ?? 0} members</span>
        <span className="flex items-center gap-1.5 font-medium"><FolderKanban className="h-3.5 w-3.5" /> {team.project_count ?? 0} projects</span>
      </div>
    </div>
  );
}
