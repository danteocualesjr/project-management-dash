import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  BarChart3, 
  ArrowRight,
  Check,
} from 'lucide-react';
import { COMPANY_NAME, ROUTES } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Vismotor PM</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.LOGIN}>Sign in</Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.REGISTER}>Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Project management for modern teams
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Streamline your workflow, collaborate with your team, and deliver projects on time. 
              Built for {COMPANY_NAME}.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={ROUTES.REGISTER}>
                  Start free trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={ROUTES.LOGIN}>Sign in to your account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 border-t bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            <p className="mt-3 text-muted-foreground">
              Powerful features to help your team succeed
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={Users}
              title="Team Management"
              description="Organize teams by department with clear roles and responsibilities."
            />
            <FeatureCard
              icon={FolderKanban}
              title="Kanban Boards"
              description="Visualize work with drag-and-drop boards that fit your workflow."
            />
            <FeatureCard
              icon={CheckSquare}
              title="Task Tracking"
              description="Create, assign, and track tasks with priorities and due dates."
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics"
              description="Get insights into team productivity with detailed reports."
            />
            <FeatureCard
              icon={Building2}
              title="Multi-team Support"
              description="Manage multiple departments from a single dashboard."
            />
            <FeatureCard
              icon={ArrowRight}
              title="Real-time Updates"
              description="Stay in sync with instant updates across your team."
            />
          </div>
        </div>
      </section>

      {/* Teams */}
      <section className="py-24 border-t">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Built for every team</h2>
            <p className="mt-3 text-muted-foreground">
              Supporting all departments at {COMPANY_NAME}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance', 'Operations'].map((team) => (
              <div
                key={team}
                className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium"
              >
                {team}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
            Join your colleagues and start managing projects more effectively today.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link href={ROUTES.REGISTER}>
                Create your account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Building2 className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-medium text-sm">Vismotor PM</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
