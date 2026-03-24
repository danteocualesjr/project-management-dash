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
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f1a]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-xs font-bold text-white">V</span>
          <span className="font-bold font-headline text-lg">Vismotor PM</span>
        </Link>
        <Button className="rounded-full px-6 shadow-lg shadow-primary/20" asChild>
          <Link href={ROUTES.DASHBOARD}>Get started free</Link>
        </Button>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-4 max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold mb-5 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Now in beta for Vismotor Corporation
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] font-headline">
            Ship projects,<br />not spreadsheets.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-lg">
            Vismotor PM gives your teams a fast, focused way to plan work, track progress, and collaborate — without the clutter.
          </p>
          <div className="mt-10">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 text-base gap-2" asChild>
              <Link href={ROUTES.DASHBOARD}>
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-900/50 p-2 shadow-[0px_24px_64px_rgba(44,52,55,0.08)] dark:shadow-black/30">
          <div className="rounded-xl bg-white dark:bg-slate-900 overflow-hidden border border-slate-200/60 dark:border-slate-800">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-slate-50 dark:bg-slate-800/50">
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
            <div className="flex min-h-[360px]">
              {/* Sidebar */}
              <div className="w-48 border-r bg-slate-50/80 dark:bg-slate-800/30 p-3 hidden sm:block">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-5 w-5 rounded bg-primary flex items-center justify-center text-[8px] font-bold text-white">V</div>
                  <span className="text-xs font-bold">Vismotor PM</span>
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
                    <div key={item.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] ${item.active ? 'bg-white dark:bg-slate-700 text-primary font-bold shadow-sm' : 'text-muted-foreground'}`}>
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 p-5">
                <div className="text-xs font-extrabold mb-4 text-foreground font-headline">Dashboard Overview</div>
                <div className="grid grid-cols-4 gap-2.5 mb-5">
                  {[
                    { label: 'Projects', value: '12', delta: '+2%' },
                    { label: 'Tasks', value: '48', delta: '-5%' },
                    { label: 'Capacity', value: '85%', delta: '+0%' },
                    { label: 'Velocity', value: '92%', delta: '+4%' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg bg-slate-50 dark:bg-slate-800 p-2.5 shadow-sm">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wide">{s.label}</span>
                      <div className="flex items-end justify-between mt-1">
                        <span className="text-base font-bold">{s.value}</span>
                        <span className="text-[9px] font-bold text-primary">{s.delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-2.5">
                  <div className="col-span-3 rounded-lg border p-3">
                    <div className="text-[10px] font-bold mb-2">Active Projects</div>
                    {['Cloud Migration', 'Mobile App Revamp', 'Security Audit'].map((t, i) => (
                      <div key={t} className="flex items-center gap-2 py-1.5 text-[11px] border-b last:border-0">
                        <span className="flex-1 font-medium">{t}</span>
                        <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${['bg-primary', 'bg-green-500', 'bg-red-500'][i]}`} style={{ width: `${[75, 40, 20][i]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-2 rounded-lg border p-3">
                    <div className="text-[10px] font-bold mb-2">Deadlines</div>
                    {[
                      { day: '24', label: 'Server Migration' },
                      { day: '26', label: 'Sprint Review' },
                      { day: '30', label: 'Compliance Audit' },
                    ].map((d) => (
                      <div key={d.day} className="flex items-center gap-2 py-1 text-[11px] border-b last:border-0">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 rounded px-1.5 py-0.5">{d.day}</span>
                        <span className="text-muted-foreground">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-y">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-lg mb-14">
            <h2 className="text-3xl font-extrabold tracking-tight font-headline">Built for how teams actually work</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Not another tool your team won&apos;t use. Vismotor PM is fast, focused, and built for real workflows.
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
              <div key={f.title} className="rounded-xl bg-white dark:bg-slate-900 p-6 shadow-[0px_12px_32px_rgba(44,52,55,0.04)] hover:-translate-y-0.5 transition-all">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-5 ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold mb-2 font-headline">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-lg mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight font-headline">Every department, one platform</h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Pre-configured for Vismotor Corporation&apos;s six core teams. Ready to go on day one.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Engineering', desc: 'Product development & technical operations', color: '#3b82f6' },
              { name: 'Marketing', desc: 'Brand, communications & growth', color: '#ec4899' },
              { name: 'Sales', desc: 'Revenue generation & client relationships', color: '#10b981' },
              { name: 'Human Resources', desc: 'People operations & talent management', color: '#8b5cf6' },
              { name: 'Finance', desc: 'Financial planning & accounting', color: '#f59e0b' },
              { name: 'Operations', desc: 'Business processes & logistics', color: '#06b6d4' },
            ].map((team) => (
              <div key={team.name} className="flex items-center gap-4 rounded-xl bg-white dark:bg-slate-900 p-5 shadow-[0px_12px_32px_rgba(44,52,55,0.04)] hover:-translate-y-0.5 transition-all">
                <div className="h-11 w-11 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: team.color }}>
                  {team.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm font-headline">{team.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{team.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 relative z-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight font-headline">Ready to streamline your projects?</h2>
            <p className="mt-3 text-white/70 text-lg">Free for all Vismotor Corporation teams. Get set up in minutes.</p>
          </div>
          <Button size="lg" variant="secondary" className="flex-shrink-0 rounded-full px-8 gap-2 text-base" asChild>
            <Link href={ROUTES.DASHBOARD}>
              Start now <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center text-[9px] font-bold text-white">V</span>
            <span className="font-bold text-foreground font-headline">Vismotor PM</span>
          </div>
          <span>&copy; {new Date().getFullYear()} Vismotor Corporation</span>
        </div>
      </footer>
    </div>
  );
}
