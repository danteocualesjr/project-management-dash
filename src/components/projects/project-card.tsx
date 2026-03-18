'use client';

import { useRouter } from 'next/navigation';
import { Project } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Calendar, CheckSquare } from 'lucide-react';
import { PROJECT_STATUS_CONFIG } from '@/types';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  planning: 'secondary',
  active: 'default',
  on_hold: 'outline',
  completed: 'secondary',
  cancelled: 'destructive',
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  
  const completedTasks = project.tasks?.filter(t => t.status === 'done').length || 0;
  const totalTasks = project.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const isOverdue = project.end_date && new Date(project.end_date) < new Date() && project.status !== 'completed';

  return (
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => router.push(`${ROUTES.PROJECTS}/${project.id}`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate mb-1">{project.name}</h3>
            <Badge variant={statusVariants[project.status]}>
              {statusConfig.label}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(project); }}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckSquare className="h-4 w-4" />
            {completedTasks}/{totalTasks}
          </span>
          {project.end_date && (
            <span className={cn(
              'flex items-center gap-1.5',
              isOverdue && 'text-destructive'
            )}>
              <Calendar className="h-4 w-4" />
              {format(new Date(project.end_date), 'MMM d')}
            </span>
          )}
        </div>

        {project.team && (
          <div className="mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">{project.team.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
