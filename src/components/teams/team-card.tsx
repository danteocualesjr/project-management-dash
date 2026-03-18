'use client';

import { useRouter } from 'next/navigation';
import { Team } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => router.push(`${ROUTES.TEAMS}/${team.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-medium"
              style={{ backgroundColor: team.color || '#6366f1' }}
            >
              {team.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium">{team.name}</h3>
              <p className="text-sm text-muted-foreground">{team.department}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(team); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(team); }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {team.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {team.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {team.members_count || 0} members
          </span>
          <span className="flex items-center gap-1.5">
            <FolderKanban className="h-4 w-4" />
            {team.projects_count || 0} projects
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
