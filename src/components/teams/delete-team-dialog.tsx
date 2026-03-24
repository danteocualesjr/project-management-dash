'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { Team } from '@/types';
import { Loader2 } from 'lucide-react';

interface DeleteTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: Team | null;
  onConfirm: () => Promise<void>;
}

export function DeleteTeamDialog({
  open,
  onOpenChange,
  team,
  onConfirm,
}: DeleteTeamDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline font-extrabold">Delete Team</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{team?.name}</strong>? This
            action cannot be undone. All projects and tasks associated with this
            team will also be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Team
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
