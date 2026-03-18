'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { useAppStore } from '@/store/use-app-store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { TrendingUp } from 'lucide-react';

const PROJECTS = [
  { name: 'Cloud Migration', status: 'In Progress', statusColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400', progress: 75, barColor: 'bg-primary', deadline: 'Mar 24, 2026' },
  { name: 'Mobile App Revamp', status: 'On Track', statusColor: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', progress: 40, barColor: 'bg-emerald-500', deadline: 'Apr 12, 2026' },
  { name: 'Security Audit', status: 'Delayed', statusColor: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400', progress: 20, barColor: 'bg-rose-500', deadline: 'Mar 30, 2026' },
];

const TEAM_MEMBERS = [
  { name: 'Sarah Johnson', tasks: 8, capacity: 95, color: 'bg-rose-400', badge: 'OVERLOAD', badgeColor: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', initials: 'SJ' },
  { name: 'James Chen', tasks: 5, capacity: 62, color: 'bg-emerald-400', badge: 'OPTIMAL', badgeColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', initials: 'JC' },
  { name: 'Mia Roberts', tasks: 2, capacity: 25, color: 'bg-blue-400', badge: 'AVAILABLE', badgeColor: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', initials: 'MR' },
];

const DEADLINES = [
  { month: 'Mar', day: '24', title: 'Server Migration Phase 1', subtitle: 'Cloud Infrastructure Project' },
  { month: 'Mar', day: '26', title: 'Sprint Review Meeting', subtitle: 'Mobile App Team' },
  { month: 'Mar', day: '30', title: 'Compliance Audit Prep', subtitle: 'Security Team' },
];

const HEALTH_BARS = [30, 45, 65, 90, 55, 40, 80];

export default function DashboardPage() {
  const { user } = useAppStore();
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-3xl font-black tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.full_name?.split(' ')[0] || 'Alex'}. You have 3 project updates since yesterday.
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Main grid: 2/3 + 1/3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Active Projects Table */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Active Projects</h3>
              <button
                onClick={() => router.push(ROUTES.PROJECTS)}
                className="text-primary text-sm font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Project Name</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Progress</th>
                    <th className="px-6 py-4 font-semibold">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PROJECTS.map((p) => (
                    <tr key={p.name} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{p.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${p.statusColor}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full ${p.barColor}`} style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs font-semibold">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">{p.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Workload */}
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-bold text-lg mb-6">Team Workload</h3>
            <div className="space-y-4">
              {TEAM_MEMBERS.map((m) => (
                <div key={m.name} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {m.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{m.name}</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {m.tasks} tasks ({m.capacity}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${m.color}`} style={{ width: `${m.capacity}%` }} />
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">

          {/* Upcoming Deadlines */}
          <div className="bg-card rounded-xl border p-6">
            <h3 className="font-bold text-lg mb-4">Upcoming Deadlines</h3>
            <div className="space-y-4">
              {DEADLINES.map((d, i) => (
                <div key={d.title} className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-lg bg-muted flex flex-col items-center justify-center">
                    <span className="text-xs font-bold uppercase leading-none">{d.month}</span>
                    <span className="text-lg font-black leading-none mt-1">{d.day}</span>
                  </div>
                  <div className={`flex-1 ${i < DEADLINES.length - 1 ? 'border-b border-border pb-4' : 'pb-2'}`}>
                    <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{d.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{d.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push(ROUTES.CALENDAR)}
              className="w-full mt-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              View Full Calendar
            </button>
          </div>

          {/* Project Health */}
          <div className="bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Project Health</h3>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="h-32 flex items-end justify-between gap-1 mb-4">
              {HEALTH_BARS.map((h, i) => (
                <div
                  key={i}
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${h}%`,
                    backgroundColor: `color-mix(in srgb, var(--primary) ${40 + (h / 100) * 60}%, transparent)`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Efficiency increased by 12% this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
