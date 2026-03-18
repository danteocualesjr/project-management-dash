'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ROUTES } from '@/lib/constants';
import { TASK_PRIORITY_CONFIG } from '@/types';
import type { Task } from '@/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const supabase = createClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*, team:teams(*))
        `)
        .gte('due_date', format(monthStart, 'yyyy-MM-dd'))
        .lte('due_date', format(monthEnd, 'yyyy-MM-dd'))
        .order('due_date');

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, currentDate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    tasks.forEach((task) => {
      if (task.due_date) {
        const dateKey = format(parseISO(task.due_date), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentDate]);

  const selectedDateTasks = selectedDate
    ? tasksByDate[format(selectedDate, 'yyyy-MM-dd')] || []
    : [];

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="View tasks and deadlines by date"
      >
        <Button variant="outline" onClick={goToToday}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Today
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Calendar Grid */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const dayTasks = tasksByDate[dateKey] || [];
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'relative min-h-24 p-2 text-left border rounded-lg transition-colors',
                      !isCurrentMonth && 'opacity-40',
                      isSelected && 'ring-2 ring-primary',
                      isTodayDate && 'bg-primary/5 border-primary',
                      !isSelected && 'hover:bg-muted/50'
                    )}
                  >
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isTodayDate && 'text-primary'
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayTasks.slice(0, 3).map((task) => {
                        const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
                        return (
                          <div
                            key={task.id}
                            className={cn(
                              'text-xs truncate px-1.5 py-0.5 rounded',
                              task.status === 'done'
                                ? 'bg-muted text-muted-foreground line-through'
                                : `${priorityConfig.color} text-white`
                            )}
                          >
                            {task.title}
                          </div>
                        );
                      })}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-muted-foreground px-1.5">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate
                ? format(selectedDate, 'EEEE, MMMM d, yyyy')
                : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Click on a date to view tasks
              </p>
            ) : selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">
                  No tasks due on this date
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {selectedDateTasks.map((task) => {
                    const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
                    return (
                      <Link
                        key={task.id}
                        href={ROUTES.PROJECT(task.project_id)}
                        className="block"
                      >
                        <div
                          className={cn(
                            'p-3 rounded-lg border hover:shadow-sm transition-shadow',
                            task.status === 'done' && 'opacity-60'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                'font-medium text-sm',
                                task.status === 'done' && 'line-through'
                              )}
                            >
                              {task.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                priorityConfig.color,
                                'text-white border-0 shrink-0'
                              )}
                            >
                              {priorityConfig.label}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          {task.project && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              {task.project.team && (
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: task.project.team.color }}
                                />
                              )}
                              <span>{task.project.name}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
