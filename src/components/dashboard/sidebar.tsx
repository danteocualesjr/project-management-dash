'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, ROUTES } from '@/lib/constants';
import { useAppStore } from '@/store/use-app-store';
import { Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppStore();

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AR';

  return (
    <aside className="w-64 bg-slate-100 dark:bg-slate-900 flex flex-col fixed h-full z-50 p-4 gap-2">
      {/* Logo */}
      <div className="px-4 py-6 mb-4">
        <Link href={ROUTES.DASHBOARD}>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-headline">
            Vismotor Corp
          </h1>
          <p className="text-xs text-muted-foreground font-medium">Project Management</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold bg-white dark:bg-slate-800 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
          onClick={() => router.push(ROUTES.SETTINGS)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback className="text-xs font-medium bg-slate-200 dark:bg-slate-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
            {user?.full_name || 'Alex Rivera'}
          </span>
          <Settings className="h-4 w-4 text-slate-400 ml-auto" />
        </div>
      </div>
    </aside>
  );
}
