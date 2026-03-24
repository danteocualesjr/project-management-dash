'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROJECT_STATUS_CONFIG } from '@/types';
import type { Project, Team, ProjectStatus } from '@/types';
import { Loader2 } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  team_id: z.string().min(1, 'Team is required'),
  status: z.enum(['planning', 'in_progress', 'on_hold', 'completed']),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  teams: Team[];
  defaultTeamId?: string;
  onSubmit: (data: ProjectFormData) => Promise<void>;
}

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  teams,
  defaultTeamId,
  onSubmit,
}: ProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      team_id: defaultTeamId || '',
      status: 'planning',
      start_date: '',
      end_date: '',
    },
  });

  const selectedTeamId = watch('team_id');
  const selectedStatus = watch('status');

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description || '',
        team_id: project.team_id,
        status: project.status,
        start_date: project.start_date || '',
        end_date: project.end_date || '',
      });
    } else {
      reset({
        name: '',
        description: '',
        team_id: defaultTeamId || '',
        status: 'planning',
        start_date: '',
        end_date: '',
      });
    }
  }, [project, defaultTeamId, reset]);

  const handleFormSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-headline font-extrabold text-lg">{project ? 'Edit Project' : 'Create Project'}</DialogTitle>
          <DialogDescription>
            {project
              ? 'Update the project details below.'
              : 'Add a new project to your team.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="e.g., Website Redesign"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this project about?"
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Team</Label>
                <Select
                  value={selectedTeamId}
                  onValueChange={(value) => setValue('team_id', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: team.color }}
                          />
                          {team.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.team_id && (
                  <p className="text-sm text-destructive">
                    {errors.team_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    value && setValue('status', value as ProjectStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROJECT_STATUS_CONFIG).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {project ? 'Save Changes' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
