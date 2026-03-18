'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS, ROUTES } from '@/lib/constants';
import { useAppStore } from '@/store/use-app-store';
import {
  Building2,
  ChevronLeft,
  Settings,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r transition-[width] duration-200',
        sidebarCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="h-4 w-4 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold">Vismotor PM</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== ROUTES.DASHBOARD && pathname.startsWith(item.href));
          const Icon = item.icon;

          const navLink = (
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  {navLink}
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{navLink}</div>;
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t space-y-1">
        {sidebarCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={ROUTES.SETTINGS}
                className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        ) : (
          <Link
            href={ROUTES.SETTINGS}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            'w-full text-muted-foreground',
            sidebarCollapsed ? 'justify-center px-2' : 'justify-start gap-3 px-3'
          )}
        >
          <ChevronLeft className={cn(
            'h-4 w-4 transition-transform',
            sidebarCollapsed && 'rotate-180'
          )} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}
