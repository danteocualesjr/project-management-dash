'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { createClient } from '@/lib/supabase/client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/use-app-store';
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG, PROJECT_STATUS_CONFIG } from '@/types';
import type { Task, Project, Team } from '@/types';
import { TrendingUp, CheckCircle2, Clock, Users } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsPage() {
  const supabase = createClient();
  const { teams } = useAppStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    overdueTasks: 0,
  });

  const [tasksByStatus, setTasksByStatus] = useState<{ name: string; value: number; color: string }[]>([]);
  const [tasksByPriority, setTasksByPriority] = useState<{ name: string; value: number; color: string }[]>([]);
  const [projectsByStatus, setProjectsByStatus] = useState<{ name: string; value: number; color: string }[]>([]);
  const [tasksTrend, setTasksTrend] = useState<{ date: string; completed: number; created: number }[]>([]);
  const [teamProductivity, setTeamProductivity] = useState<{ name: string; tasks: number; completed: number }[]>([]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);

      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');

      let tasksQuery = supabase
        .from('tasks')
        .select(`
          *,
          project:projects(*, team:teams(*))
        `);

      if (selectedTeam !== 'all') {
        tasksQuery = tasksQuery.eq('project.team_id', selectedTeam);
      }

      const { data: tasks } = await tasksQuery;

      let projectsQuery = supabase.from('projects').select('*');
      if (selectedTeam !== 'all') {
        projectsQuery = projectsQuery.eq('team_id', selectedTeam);
      }
      const { data: projects } = await projectsQuery;

      if (tasks) {
        const total = tasks.length;
        const completed = tasks.filter((t) => t.status === 'done').length;
        const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
        const overdue = tasks.filter(
          (t) => t.due_date && t.due_date < today && t.status !== 'done'
        ).length;

        setStats({
          totalTasks: total,
          completedTasks: completed,
          inProgressTasks: inProgress,
          overdueTasks: overdue,
        });

        const statusCounts: Record<string, number> = {};
        const priorityCounts: Record<string, number> = {};

        tasks.forEach((task) => {
          statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
          priorityCounts[task.priority] = (priorityCounts[task.priority] || 0) + 1;
        });

        setTasksByStatus(
          Object.entries(TASK_STATUS_CONFIG).map(([key, config]) => ({
            name: config.label,
            value: statusCounts[key] || 0,
            color: config.color.replace('bg-', ''),
          }))
        );

        setTasksByPriority(
          Object.entries(TASK_PRIORITY_CONFIG).map(([key, config]) => ({
            name: config.label,
            value: priorityCounts[key] || 0,
            color: config.color.replace('bg-', ''),
          }))
        );

        const trendData: Record<string, { completed: number; created: number }> = {};
        for (let i = 0; i < daysBack; i++) {
          const date = format(subDays(new Date(), daysBack - 1 - i), 'MMM d');
          trendData[date] = { completed: 0, created: 0 };
        }

        tasks.forEach((task) => {
          const createdDate = format(new Date(task.created_at), 'MMM d');
          if (trendData[createdDate]) {
            trendData[createdDate].created++;
          }
          if (task.status === 'done' && task.updated_at) {
            const completedDate = format(new Date(task.updated_at), 'MMM d');
            if (trendData[completedDate]) {
              trendData[completedDate].completed++;
            }
          }
        });

        setTasksTrend(
          Object.entries(trendData).map(([date, data]) => ({
            date,
            ...data,
          }))
        );

        const teamStats: Record<string, { tasks: number; completed: number }> = {};
        tasks.forEach((task) => {
          const teamName = task.project?.team?.name || 'Unassigned';
          if (!teamStats[teamName]) {
            teamStats[teamName] = { tasks: 0, completed: 0 };
          }
          teamStats[teamName].tasks++;
          if (task.status === 'done') {
            teamStats[teamName].completed++;
          }
        });

        setTeamProductivity(
          Object.entries(teamStats).map(([name, data]) => ({
            name,
            ...data,
          }))
        );
      }

      if (projects) {
        const projectStatusCounts: Record<string, number> = {};
        projects.forEach((project) => {
          projectStatusCounts[project.status] =
            (projectStatusCounts[project.status] || 0) + 1;
        });

        setProjectsByStatus(
          Object.entries(PROJECT_STATUS_CONFIG).map(([key, config]) => ({
            name: config.label,
            value: projectStatusCounts[key] || 0,
            color: config.color.replace('bg-', ''),
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, timeRange, selectedTeam]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Track progress and team performance"
      >
        <div className="flex items-center gap-2">
          <Select value={selectedTeam} onValueChange={(value) => setSelectedTeam(value || 'all')}>
            <SelectTrigger className="h-8 w-[160px] text-xs">
              <SelectValue placeholder="All Teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    {team.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value || '7d')}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Tasks', value: stats.totalTasks, sub: `${stats.completedTasks} completed`, icon: CheckCircle2, accent: false },
          { label: 'Completion Rate', value: `${completionRate}%`, sub: 'Overall completion rate', icon: TrendingUp, accent: true },
          { label: 'In Progress', value: stats.inProgressTasks, sub: 'Currently active tasks', icon: Clock, accent: false },
          { label: 'Overdue', value: stats.overdueTasks, sub: 'Tasks past due date', icon: Clock, accent: false, destructive: true },
        ].map((card) => (
          <div
            key={card.label}
            className={`bg-white dark:bg-slate-900 p-6 rounded-xl shadow-[0px_12px_32px_rgba(44,52,55,0.04)] hover:-translate-y-0.5 transition-all ${card.accent ? 'border-l-4 border-primary' : ''}`}
          >
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase mb-3">{card.label}</p>
            <h3 className={`text-3xl font-bold font-headline ${card.destructive ? 'text-destructive' : card.accent ? 'text-primary' : ''}`}>
              {card.value}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Task Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Task Activity</CardTitle>
                <CardDescription>
                  Tasks created and completed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tasksTrend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="created"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                        name="Created"
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        name="Completed"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Project Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Project Status Distribution</CardTitle>
                <CardDescription>
                  Projects by current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {projectsByStatus.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Tasks by Status */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Tasks by Status</CardTitle>
                <CardDescription>
                  Distribution of tasks across statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tasksByStatus} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {tasksByStatus.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tasks by Priority */}
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Tasks by Priority</CardTitle>
                <CardDescription>
                  Distribution of tasks by priority level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tasksByPriority}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {tasksByPriority.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="font-headline">Team Productivity</CardTitle>
              <CardDescription>
                Tasks completed vs total tasks per team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamProductivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="tasks"
                      fill="#3B82F6"
                      name="Total Tasks"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="completed"
                      fill="#10B981"
                      name="Completed"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
