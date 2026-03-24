'use client';

import { useRouter } from 'next/navigation';
import { Project, PROJECT_STATUS_CONFIG } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Calendar } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const statusDot: Record<string, string> = {
  planning: 'bg-slate-400',
  in_progress: 'bg-blue-500',
  on_hold: 'bg-amber-500',
  completed: 'bg-emerald-500',
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const statusConfig = PROJECT_STATUS_CONFIG[project.status];
  const completed = project.completed_task_count ?? 0;
  const total = project.task_count ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const overdue = project.end_date && new Date(project.end_date) < new Date() && project.status !== 'completed';

  return (
    <div
      className="rounded-xl bg-white dark:bg-slate-900 p-5 shadow-[0px_12px_32px_rgba(44,52,55,0.04)] hover:-translate-y-0.5 hover:shadow-[0px_16px_40px_rgba(44,52,55,0.08)] transition-all cursor-pointer"
      onClick={() => router.push(`${ROUTES.PROJECTS}/${project.id}`)}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="font-bold text-sm truncate flex-1 font-headline">{project.name}</p>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(project); }}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <span className={cn('h-2 w-2 rounded-full', statusDot[project.status] || 'bg-slate-400')} />
        <span className="text-xs text-muted-foreground font-medium">{statusConfig.label}</span>
      </div>

      {project.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
      )}

      {total > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">{completed} of {total} tasks</span>
            <span className="font-bold tabular-nums">{pct}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-slate-100 dark:border-slate-800">
        {project.team ? <span className="font-medium">{project.team.name}</span> : <span />}
        {project.end_date && (
          <span className={cn('flex items-center gap-1', overdue && 'text-destructive font-medium')}>
            <Calendar className="h-3 w-3" />
            {format(new Date(project.end_date), 'MMM d')}
          </span>
        )}
      </div>
    </div>
  );
}
