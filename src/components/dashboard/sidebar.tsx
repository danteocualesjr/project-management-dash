'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, ROUTES } from '@/lib/constants';
import { useAppStore } from '@/store/use-app-store';
import { Settings, Rocket } from 'lucide-react';
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
    <aside className="w-64 border-r border-border bg-card dark:bg-background flex flex-col fixed h-full z-50">
      {/* Logo */}
      <div className="p-6">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-2 text-white">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none">Vismotor Corp</h1>
            <p className="text-xs text-muted-foreground mt-1">Project Suite</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
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
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-muted-foreground hover:bg-accent dark:hover:bg-accent transition-colors'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="p-4 border-t border-border">
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          onClick={() => router.push(ROUTES.SETTINGS)}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback className="text-xs font-medium bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.full_name || 'Alex Rivera'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'Project Lead'}
            </p>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}
