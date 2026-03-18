import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  Calendar,
  BarChart3,
  Columns3,
  type LucideIcon,
} from 'lucide-react';

export const APP_NAME = 'Vismotor PM';
export const COMPANY_NAME = 'Vismotor Corporation';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TEAMS: '/teams',
  TEAM: (id: string) => `/teams/${id}`,
  TEAM_PROJECTS: (id: string) => `/teams/${id}/projects`,
  TEAM_MEMBERS: (id: string) => `/teams/${id}/members`,
  TEAM_SETTINGS: (id: string) => `/teams/${id}/settings`,
  PROJECTS: '/projects',
  PROJECT: (id: string) => `/projects/${id}`,
  PROJECT_SETTINGS: (id: string) => `/projects/${id}/settings`,
  BOARD: '/board',
  TASKS: '/tasks',
  CALENDAR: '/calendar',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
} as const;

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Teams', href: ROUTES.TEAMS, icon: Users },
  { label: 'Projects', href: ROUTES.PROJECTS, icon: FolderKanban },
  { label: 'Board', href: ROUTES.BOARD, icon: Columns3 },
  { label: 'My Tasks', href: ROUTES.TASKS, icon: CheckSquare },
  { label: 'Calendar', href: ROUTES.CALENDAR, icon: Calendar },
  { label: 'Analytics', href: ROUTES.ANALYTICS, icon: BarChart3 },
];
