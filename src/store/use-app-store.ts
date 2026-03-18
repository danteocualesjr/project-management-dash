import { create } from 'zustand';
import type { User, Team, Project, Task } from '@/types';

interface AppState {
  user: User | null;
  teams: Team[];
  currentTeam: Team | null;
  projects: Project[];
  currentProject: Project | null;
  tasks: Task[];
  isLoading: boolean;
  sidebarOpen: boolean;

  setUser: (user: User | null) => void;
  setTeams: (teams: Team[]) => void;
  setCurrentTeam: (team: Team | null) => void;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setTasks: (tasks: Task[]) => void;
  setIsLoading: (loading: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  removeProject: (projectId: string) => void;
  
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  moveTask: (taskId: string, newStatus: Task['status'], newPosition: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  teams: [],
  currentTeam: null,
  projects: [],
  currentProject: null,
  tasks: [],
  isLoading: false,
  sidebarOpen: true,

  setUser: (user) => set({ user }),
  setTeams: (teams) => set({ teams }),
  setCurrentTeam: (currentTeam) => set({ currentTeam }),
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  setTasks: (tasks) => set({ tasks }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
  updateTeam: (team) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === team.id ? team : t)),
      currentTeam: state.currentTeam?.id === team.id ? team : state.currentTeam,
    })),
  removeTeam: (teamId) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== teamId),
      currentTeam: state.currentTeam?.id === teamId ? null : state.currentTeam,
    })),

  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (project) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === project.id ? project : p)),
      currentProject: state.currentProject?.id === project.id ? project : state.currentProject,
    })),
  removeProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      currentProject: state.currentProject?.id === projectId ? null : state.currentProject,
    })),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
  moveTask: (taskId, newStatus, newPosition) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, position: newPosition } : t
      ),
    })),
}));
