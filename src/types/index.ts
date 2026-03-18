export type UserRole = 'admin' | 'manager' | 'member' | 'viewer';
export type TeamRole = 'admin' | 'member' | 'viewer';
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  member_count?: number;
  project_count?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
  user?: User;
}

export interface Project {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  start_date?: string;
  end_date?: string;
  created_at: string;
  team?: Team;
  task_count?: number;
  completed_task_count?: number;
}

export interface Task {
  id: string;
  project_id: string;
  assigned_to?: string;
  created_by: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  position: number;
  created_at: string;
  updated_at: string;
  project?: Project;
  assignee?: User;
  creator?: User;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface Activity {
  id: string;
  user_id: string;
  action: string;
  entity_type: 'task' | 'project' | 'team' | 'comment';
  entity_id: string;
  entity_name: string;
  created_at: string;
  user?: User;
}

export interface DashboardStats {
  total_teams: number;
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  tasks_due_soon: number;
}

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-slate-500' },
  todo: { label: 'To Do', color: 'bg-blue-500' },
  in_progress: { label: 'In Progress', color: 'bg-yellow-500' },
  review: { label: 'Review', color: 'bg-purple-500' },
  done: { label: 'Done', color: 'bg-green-500' },
};

export const TASK_PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'bg-blue-400' },
  high: { label: 'High', color: 'bg-orange-500' },
  urgent: { label: 'Urgent', color: 'bg-red-500' },
};

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  planning: { label: 'Planning', color: 'bg-slate-500' },
  in_progress: { label: 'In Progress', color: 'bg-blue-500' },
  on_hold: { label: 'On Hold', color: 'bg-yellow-500' },
  completed: { label: 'Completed', color: 'bg-green-500' },
};

export const TEAM_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

export const DEFAULT_TEAMS = [
  { name: 'Engineering', color: '#3B82F6', description: 'Product development and technical operations' },
  { name: 'Marketing', color: '#EC4899', description: 'Brand, communications, and growth initiatives' },
  { name: 'Sales', color: '#10B981', description: 'Revenue generation and client relationships' },
  { name: 'Human Resources', color: '#8B5CF6', description: 'People operations and talent management' },
  { name: 'Finance', color: '#F59E0B', description: 'Financial planning and accounting' },
  { name: 'Operations', color: '#06B6D4', description: 'Business processes and logistics' },
];
