'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, ROUTES } from '@/lib/constants';
import { useAppStore } from '@/store/use-app-store';
import { Settings, ChevronsLeft } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-[width] duration-150',
        sidebarCollapsed ? 'w-14' : 'w-56'
      )}
    >
      <div className={cn(
        'flex items-center h-12 border-b px-3',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 min-w-0">
          <span className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            V
          </span>
          {!sidebarCollapsed && (
            <span className="text-sm font-semibold truncate">Vismotor PM</span>
          )}
        </Link>
        {!sidebarCollapsed && (
          <button
            className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={() => setSidebarCollapsed(true)}
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t py-2 px-2 space-y-0.5">
        <Link
          href={ROUTES.SETTINGS}
          title={sidebarCollapsed ? 'Settings' : undefined}
          className={cn(
            'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
            pathname === ROUTES.SETTINGS && 'bg-primary/10 text-primary'
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!sidebarCollapsed && <span>Settings</span>}
        </Link>

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            title="Expand sidebar"
            className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
          >
            <ChevronsLeft className="h-4 w-4 rotate-180" />
          </button>
        )}
      </div>
    </aside>
  );
}
