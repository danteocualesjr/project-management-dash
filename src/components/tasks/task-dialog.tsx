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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from '@/types';
import type { Task, User, TaskStatus, TaskPriority } from '@/types';
import { Loader2 } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  assigned_to: z.string().optional(),
  due_date: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  users: User[];
  defaultStatus?: TaskStatus;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  users,
  defaultStatus = 'backlog',
  onSubmit,
  onDelete,
}: TaskDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'medium',
      assigned_to: '',
      due_date: '',
    },
  });

  const selectedStatus = watch('status');
  const selectedPriority = watch('priority');
  const selectedAssignee = watch('assigned_to');

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assigned_to: task.assigned_to || '',
        due_date: task.due_date || '',
      });
    } else {
      reset({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        assigned_to: '',
        due_date: '',
      });
    }
  }, [task, defaultStatus, reset]);

  const handleFormSubmit = async (data: TaskFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-headline font-extrabold text-lg">{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>
            {task ? 'Update the task details below.' : 'Add a new task to this project.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g., Implement user authentication"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the task in detail..."
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
                <Label>Status</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => value && setValue('status', value as TaskStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TASK_STATUS_CONFIG).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <div className={cn('h-2 w-2 rounded-full', config.color)} />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={selectedPriority}
                  onValueChange={(value) => value && setValue('priority', value as TaskPriority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TASK_PRIORITY_CONFIG).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <div className={cn('h-2 w-2 rounded-full', config.color)} />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select
                  value={selectedAssignee}
                  onValueChange={(value) => setValue('assigned_to', value || '')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          {user.full_name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  {...register('due_date')}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {task && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading || isDeleting}
              >
                {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading || isDeleting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isDeleting}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {task ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
