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
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Vismotor<span className="text-muted-foreground font-normal ml-1">PM</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={ROUTES.LOGIN}>Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={ROUTES.REGISTER}>Sign up</Link>
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        <section className="py-20 md:py-32 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
            Ship projects,<br />not spreadsheets.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg">
            Vismotor PM gives your teams a fast, focused way to plan work, track progress, and collaborate — without the clutter.
          </p>
          <div className="mt-8 flex gap-3">
            <Button asChild>
              <Link href={ROUTES.REGISTER}>
                Get started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.LOGIN}>Log in</Link>
            </Button>
          </div>
        </section>

        <section className="py-16 border-t">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-lg overflow-hidden border">
            {[
              { icon: Users, title: 'Teams', desc: 'Organize by department. Engineering, Sales, Marketing — each with its own workspace.' },
              { icon: FolderKanban, title: 'Kanban boards', desc: 'Drag and drop tasks across columns. See where everything stands at a glance.' },
              { icon: CheckSquare, title: 'Task management', desc: 'Priorities, due dates, assignments. Everything you need to stay on track.' },
              { icon: BarChart3, title: 'Analytics', desc: 'Track velocity, completion rates, and workload distribution across teams.' },
              { icon: Zap, title: 'Real-time', desc: 'Changes sync instantly. No more stale data or "did you refresh?"' },
              { icon: Shield, title: 'Secure', desc: 'Row-level security, encrypted data, and role-based access controls.' },
            ].map((f) => (
              <div key={f.title} className="bg-card p-6">
                <f.icon className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-3 font-medium">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 border-t">
          <p className="text-sm text-muted-foreground mb-4">Built for</p>
          <div className="flex flex-wrap gap-2">
            {['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations'].map((t) => (
              <span key={t} className="px-3 py-1.5 text-sm border rounded-md bg-card">{t}</span>
            ))}
          </div>
        </section>

        <section className="py-16 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Start managing projects today</h2>
              <p className="mt-1 text-muted-foreground">Free for teams at Vismotor Corporation.</p>
            </div>
            <Button asChild>
              <Link href={ROUTES.REGISTER}>
                Get started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Vismotor PM</span>
          <span>© {new Date().getFullYear()} Vismotor Corporation</span>
        </div>
      </footer>
    </div>
  );
}
