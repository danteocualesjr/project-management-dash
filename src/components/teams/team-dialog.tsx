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
import { TEAM_COLORS } from '@/types';
import type { Team } from '@/types';
import { Loader2, Check } from 'lucide-react';

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional(),
  color: z.string(),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface TeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: Team | null;
  onSubmit: (data: TeamFormData) => Promise<void>;
}

export function TeamDialog({
  open,
  onOpenChange,
  team,
  onSubmit,
}: TeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      color: TEAM_COLORS[0],
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        description: team.description || '',
        color: team.color,
      });
    } else {
      reset({
        name: '',
        description: '',
        color: TEAM_COLORS[0],
      });
    }
  }, [team, reset]);

  const handleFormSubmit = async (data: TeamFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to save team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{team ? 'Edit Team' : 'Create Team'}</DialogTitle>
          <DialogDescription>
            {team
              ? 'Update the team details below.'
              : 'Add a new team to your organization.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                placeholder="e.g., Engineering"
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
                placeholder="What does this team do?"
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Team Color</Label>
              <div className="flex flex-wrap gap-2">
                {TEAM_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: color }}
                    onClick={() => setValue('color', color)}
                  >
                    {selectedColor === color && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </button>
                ))}
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
              {team ? 'Save Changes' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
