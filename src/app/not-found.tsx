import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d1117] px-6">
      <div className="text-center animate-slide-up">
        <div className="text-8xl font-extrabold font-headline text-primary/20 mb-2 select-none">404</div>
        <h1 className="text-2xl font-extrabold tracking-tight font-headline mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button className="rounded-full px-6 shadow-lg shadow-primary/20 gap-2" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
