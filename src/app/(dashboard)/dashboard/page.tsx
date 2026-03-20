'use client';

import { StatsCards } from '@/components/dashboard/stats-cards';
import { useAppStore } from '@/store/use-app-store';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

const PROJECTS = [
  { name: 'Cloud Migration', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', progress: 75, barColor: 'bg-primary', deadline: 'Mar 24, 2026' },
  { name: 'Mobile App Revamp', status: 'On Track', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', progress: 40, barColor: 'bg-green-500', deadline: 'Apr 12, 2026' },
  { name: 'Security Audit', status: 'Delayed', statusColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', progress: 20, barColor: 'bg-red-500', deadline: 'Mar 30, 2026' },
];

const DEADLINES = [
  { month: 'Mar', day: '24', title: 'Server Migration Phase 1', subtitle: 'High Priority', dateBg: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
  { month: 'Mar', day: '26', title: 'Sprint Review Meeting', subtitle: 'Internal Team', dateBg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
  { month: 'Mar', day: '30', title: 'Compliance Audit Prep', subtitle: 'External Deadline', dateBg: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
];

const TEAM_MEMBERS = [
  { name: 'Sarah Johnson', role: 'Product Designer', utilization: 60, segments: [true, true, true, false, false], avatar: 'SJ' },
  { name: 'David Chen', role: 'Lead Engineer', utilization: 100, segments: [true, true, true, true, true], lastSegmentReview: true, avatar: 'DC' },
  { name: 'Elena Rodriguez', role: 'QA Specialist', utilization: 40, segments: [true, true, false, false, false], avatar: 'ER' },
];

export default function DashboardPage() {
  const { user } = useAppStore();
  const router = useRouter();
  const firstName = user?.full_name?.split(' ')[0] || 'Alex';

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <section className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight font-headline">Dashboard Overview</h2>
        <p className="text-muted-foreground text-lg">
          Welcome back, {firstName}. You have{' '}
          <span className="text-primary font-bold">3 project updates</span> since yesterday.
        </p>
      </section>

      {/* KPI Cards */}
      <StatsCards />

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Active Projects Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-headline">Active Projects</h3>
            <button
              onClick={() => router.push(ROUTES.PROJECTS)}
              className="text-primary text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-[0px_12px_32px_rgba(44,52,55,0.04)]">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {PROJECTS.map((p) => (
                  <tr key={p.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-5 font-semibold">{p.name}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${p.statusColor}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${p.barColor}`} style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block">{p.progress}% Complete</span>
                    </td>
                    <td className="px-6 py-5 text-sm text-muted-foreground">{p.deadline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold font-headline">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {DEADLINES.map((d) => (
              <div
                key={d.title}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl flex items-center gap-4 shadow-[0px_12px_32px_rgba(44,52,55,0.04)] hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <div className={`${d.dateBg} px-3 py-2 rounded-lg text-center min-w-[56px]`}>
                  <span className="block text-lg font-bold">{d.day}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">{d.month}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">{d.title}</h4>
                  <p className="text-xs text-muted-foreground">{d.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Card */}
          <div className="bg-primary rounded-2xl p-6 text-white overflow-hidden relative group">
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-bold font-headline leading-tight">
                Maximize your team&apos;s throughput.
              </h4>
              <p className="text-sm font-medium opacity-80">
                Review new analytics insights for the Q2 roadmap.
              </p>
              <button
                onClick={() => router.push(ROUTES.ANALYTICS)}
                className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Open Insights
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>

      {/* Team Workload Summary */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-headline">Team Workload Summary</h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs font-bold text-muted-foreground">Tasks</span>
            <span className="w-3 h-3 rounded-full bg-violet-600 ml-4" />
            <span className="text-xs font-bold text-muted-foreground">Reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((m) => (
            <div key={m.name} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                  {m.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {m.segments.map((filled, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      filled
                        ? m.lastSegmentReview && i === m.segments.length - 1
                          ? 'bg-violet-600'
                          : 'bg-primary'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                {m.utilization}% UTILIZED
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
