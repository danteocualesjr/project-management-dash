'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirm = formData.get('confirmPassword') as string;

    if (password !== confirm) { setError('Passwords do not match'); setIsLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); setIsLoading(false); return; }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
          <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight font-headline">Check your email</h1>
          <p className="text-sm text-muted-foreground mt-2">
            We sent you a confirmation link. Click it to activate your account.
          </p>
        </div>
        <Button variant="outline" asChild className="rounded-lg">
          <Link href={ROUTES.DASHBOARD}>Go to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight font-headline">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your details to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg font-medium">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
          <Input id="fullName" name="fullName" placeholder="Jane Doe" required disabled={isLoading} className="h-11 bg-white dark:bg-slate-900 shadow-sm" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@vismotor.com" required disabled={isLoading} className="h-11 bg-white dark:bg-slate-900 shadow-sm" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input id="password" name="password" type="password" required disabled={isLoading} className="h-11 bg-white dark:bg-slate-900 shadow-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} className="h-11 bg-white dark:bg-slate-900 shadow-sm" />
          </div>
        </div>
        <Button type="submit" className="w-full h-11 rounded-lg shadow-lg shadow-primary/20 font-bold" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN} className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
