'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/use-app-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Moon, Sun, Search, LogOut, Settings, User, Bell, Plus } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

export function Header() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user } = useAppStore();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(ROUTES.HOME);
    router.refresh();
  };

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <>
      <div className="accent-bar" />
      <header className="h-16 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
        {/* Search */}
        <div className="flex items-center bg-slate-200/60 dark:bg-slate-800/60 rounded-full px-4 py-1.5 w-96 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:shadow-lg transition-all group">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search projects or teams..."
            className="bg-transparent border-none text-sm w-full focus:ring-0 focus:outline-none placeholder:text-muted-foreground p-0"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shrink-0 group-focus-within:opacity-0 transition-opacity">
            ⌘K
          </kbd>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-slate-500 hover:text-primary transition-all"
          >
            <Sun className="h-5 w-5 block dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </button>

          <button className="text-slate-500 hover:text-primary transition-all relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            onClick={() => router.push(ROUTES.SETTINGS)}
            className="text-slate-500 hover:text-primary transition-all"
          >
            <Settings className="h-5 w-5" />
          </button>

          <Button
            className="rounded-full px-5 shadow-lg shadow-primary/20 gap-2"
            onClick={() => router.push(ROUTES.PROJECTS)}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.avatar_url || undefined} />
                <AvatarFallback className="text-[10px] bg-slate-200 dark:bg-slate-700">{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(ROUTES.SETTINGS)}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
