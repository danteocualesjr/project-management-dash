import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight,
  Users,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Zap,
  Shield,
  LayoutDashboard,
  Calendar,
  Columns3,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f1a]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-[11px] font-bold text-white">V</span>
          <span className="font-semibold">Vismotor PM</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href={ROUTES.DASHBOARD}>Get started free</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-4 max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-sm text-primary font-medium mb-4 bg-primary/5 border border-primary/10 rounded-full px-3.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Now in beta for Vismotor Corporation
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08]">
            Ship projects,<br />not spreadsheets.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
            Vismotor PM gives your teams a fast, focused way to plan work, track progress, and collaborate — without the clutter.
          </p>
          <div className="mt-8 flex gap-3">
            <Button size="lg" asChild>
              <Link href={ROUTES.DASHBOARD}>
                Get started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-20">
        <div className="rounded-xl border bg-slate-50 dark:bg-slate-900/50 p-1.5 shadow-2xl shadow-slate-200/50 dark:shadow-black/30">
          <div className="rounded-lg border bg-white dark:bg-slate-900 overflow-hidden">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b bg-slate-50 dark:bg-slate-800/50">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white dark:bg-slate-700 border rounded-md px-3 py-0.5 text-[11px] text-muted-foreground w-64 text-center">
                  app.vismotor.com/dashboard
                </div>
              </div>
            </div>
            {/* Fake dashboard */}
            <div className="flex min-h-[340px]">
              {/* Fake sidebar */}
              <div className="w-48 border-r bg-slate-50/50 dark:bg-slate-800/30 p-3 hidden sm:block">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-5 w-5 rounded bg-primary flex items-center justify-center text-[8px] font-bold text-white">V</div>
                  <span className="text-xs font-medium">Vismotor PM</span>
                </div>
                <div className="space-y-0.5">
                  {[
                    { icon: LayoutDashboard, label: 'Dashboard', active: true },
                    { icon: Users, label: 'Teams', active: false },
                    { icon: FolderKanban, label: 'Projects', active: false },
                    { icon: CheckSquare, label: 'Tasks', active: false },
                    { icon: Calendar, label: 'Calendar', active: false },
                    { icon: BarChart3, label: 'Analytics', active: false },
                  ].map((item) => (
                    <div key={item.label} className={`flex items-center gap-2 px-2 py-1 rounded text-[11px] ${item.active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}>
                      <item.icon className="h-3 w-3" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              {/* Fake content */}
              <div className="flex-1 p-4">
                <div className="text-xs font-medium mb-3 text-foreground">Dashboard</div>
                <div className="grid grid-cols-4 gap-2.5 mb-4">
                  {[
                    { label: 'Projects', value: '12', color: 'bg-blue-500' },
                    { label: 'Tasks', value: '48', color: 'bg-emerald-500' },
                    { label: 'Completed', value: '31', color: 'bg-violet-500' },
                    { label: 'Teams', value: '6', color: 'bg-amber-500' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${s.color}`} />
                        <span className="text-[10px] text-muted-foreground">{s.label}</span>
                      </div>
                      <span className="text-lg font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-2.5">
                  <div className="col-span-3 rounded-lg border p-2.5">
                    <div className="text-[10px] font-medium mb-2">Upcoming tasks</div>
                    {['API integration', 'Design review', 'Sprint planning', 'Deploy v2.1'].map((t, i) => (
                      <div key={t} className="flex items-center gap-2 py-1 text-[11px] border-b last:border-0">
                        <div className={`h-1.5 w-1.5 rounded-full ${['bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-emerald-400'][i]}`} />
                        <span className="flex-1">{t}</span>
                        <span className="text-muted-foreground text-[10px]">{['Today', 'Tomorrow', 'Wed', 'Thu'][i]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-2 rounded-lg border p-2.5">
                    <div className="text-[10px] font-medium mb-2">Activity</div>
                    {['Created task', 'Completed task', 'Added member', 'Updated project'].map((a) => (
                      <div key={a} className="py-1 text-[10px] text-muted-foreground border-b last:border-0">{a}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30 border-y">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-lg mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Built for how teams actually work</h2>
            <p className="mt-3 text-muted-foreground">
              Not another tool your team won't use. Vismotor PM is fast, focused, and built for real workflows.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: 'Teams', desc: 'Organize by department. Each team gets its own workspace, members, and projects.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
              { icon: FolderKanban, title: 'Kanban boards', desc: 'Drag and drop tasks across columns. See status at a glance and keep work moving.', color: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10' },
              { icon: CheckSquare, title: 'Task management', desc: 'Priorities, due dates, and assignments. Everything to stay on track without overhead.', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' },
              { icon: BarChart3, title: 'Analytics', desc: 'Completion rates, velocity charts, and workload distribution across all teams.', color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
              { icon: Zap, title: 'Real-time', desc: 'Changes sync instantly across all users. No more stale data or manual refreshes.', color: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10' },
              { icon: Shield, title: 'Secure by default', desc: 'Row-level security, encrypted storage, and role-based access on every resource.', color: 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border bg-card p-5">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="h-[18px] w-[18px]" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-lg mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Every department, one platform</h2>
            <p className="mt-3 text-muted-foreground">
              Pre-configured for Vismotor Corporation's six core teams. Ready to go on day one.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'Engineering', desc: 'Product development & technical operations', color: '#3b82f6' },
              { name: 'Marketing', desc: 'Brand, communications & growth', color: '#ec4899' },
              { name: 'Sales', desc: 'Revenue generation & client relationships', color: '#10b981' },
              { name: 'Human Resources', desc: 'People operations & talent management', color: '#8b5cf6' },
              { name: 'Finance', desc: 'Financial planning & accounting', color: '#f59e0b' },
              { name: 'Operations', desc: 'Business processes & logistics', color: '#06b6d4' },
            ].map((team) => (
              <div key={team.name} className="flex items-center gap-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: team.color }}>
                  {team.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">{team.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{team.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Ready to streamline your projects?</h2>
            <p className="mt-2 text-white/70">Free for all Vismotor Corporation teams. Get set up in minutes.</p>
          </div>
          <Button size="lg" variant="secondary" asChild className="flex-shrink-0">
            <Link href={ROUTES.DASHBOARD}>
              Start now <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded bg-primary flex items-center justify-center text-[8px] font-bold text-white">V</span>
            <span className="font-medium text-foreground">Vismotor PM</span>
          </div>
          <span>© {new Date().getFullYear()} Vismotor Corporation</span>
        </div>
      </footer>
    </div>
  );
}
