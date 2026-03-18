-- Vismotor Corporation Project Management Dashboard
-- Initial Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Teams table
CREATE TABLE public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team members junction table
CREATE TABLE public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Projects table
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'review', 'done')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date DATE,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments table
CREATE TABLE public.comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activity log table
CREATE TABLE public.activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('task', 'project', 'team', 'comment')),
    entity_id UUID NOT NULL,
    entity_name TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_projects_team_id ON public.projects(team_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_comments_task_id ON public.comments(task_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for teams (users can see teams they belong to)
CREATE POLICY "Users can view teams they belong to" ON public.teams
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = teams.id
            AND team_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can update their teams" ON public.teams
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = teams.id
            AND team_members.user_id = auth.uid()
            AND team_members.role = 'admin'
        )
    );

CREATE POLICY "Authenticated users can create teams" ON public.teams
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Team admins can delete teams" ON public.teams
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = teams.id
            AND team_members.user_id = auth.uid()
            AND team_members.role = 'admin'
        )
    );

-- RLS Policies for team_members
CREATE POLICY "Users can view team members of their teams" ON public.team_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_members.team_id
            AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can manage team members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_members.team_id
            AND tm.user_id = auth.uid()
            AND tm.role = 'admin'
        )
    );

-- RLS Policies for projects
CREATE POLICY "Users can view projects of their teams" ON public.projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = projects.team_id
            AND team_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create projects" ON public.projects
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = projects.team_id
            AND team_members.user_id = auth.uid()
            AND team_members.role IN ('admin', 'member')
        )
    );

CREATE POLICY "Team members can update projects" ON public.projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = projects.team_id
            AND team_members.user_id = auth.uid()
            AND team_members.role IN ('admin', 'member')
        )
    );

CREATE POLICY "Team admins can delete projects" ON public.projects
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.team_members
            WHERE team_members.team_id = projects.team_id
            AND team_members.user_id = auth.uid()
            AND team_members.role = 'admin'
        )
    );

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks of their team projects" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.team_members tm ON tm.team_id = p.team_id
            WHERE p.id = tasks.project_id
            AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create tasks" ON public.tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.team_members tm ON tm.team_id = p.team_id
            WHERE p.id = tasks.project_id
            AND tm.user_id = auth.uid()
            AND tm.role IN ('admin', 'member')
        )
    );

CREATE POLICY "Team members can update tasks" ON public.tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.team_members tm ON tm.team_id = p.team_id
            WHERE p.id = tasks.project_id
            AND tm.user_id = auth.uid()
            AND tm.role IN ('admin', 'member')
        )
    );

CREATE POLICY "Team admins can delete tasks" ON public.tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            JOIN public.team_members tm ON tm.team_id = p.team_id
            WHERE p.id = tasks.project_id
            AND tm.user_id = auth.uid()
            AND tm.role = 'admin'
        )
    );

-- RLS Policies for comments
CREATE POLICY "Users can view comments on tasks they can see" ON public.comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.projects p ON p.id = t.project_id
            JOIN public.team_members tm ON tm.team_id = p.team_id
            WHERE t.id = comments.task_id
            AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can create comments" ON public.comments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.tasks t
            JOIN public.projects p ON p.id = t.project_id
            JOIN public.team_members tm ON tm.team_id = p.team_id
            WHERE t.id = comments.task_id
            AND tm.user_id = auth.uid()
            AND tm.role IN ('admin', 'member')
        )
    );

CREATE POLICY "Users can update their own comments" ON public.comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for activities
CREATE POLICY "Users can view activities of their teams" ON public.activities
    FOR SELECT USING (
        CASE 
            WHEN entity_type = 'team' THEN
                EXISTS (
                    SELECT 1 FROM public.team_members
                    WHERE team_members.team_id = activities.entity_id
                    AND team_members.user_id = auth.uid()
                )
            WHEN entity_type = 'project' THEN
                EXISTS (
                    SELECT 1 FROM public.projects p
                    JOIN public.team_members tm ON tm.team_id = p.team_id
                    WHERE p.id = activities.entity_id
                    AND tm.user_id = auth.uid()
                )
            WHEN entity_type = 'task' THEN
                EXISTS (
                    SELECT 1 FROM public.tasks t
                    JOIN public.projects p ON p.id = t.project_id
                    JOIN public.team_members tm ON tm.team_id = p.team_id
                    WHERE t.id = activities.entity_id
                    AND tm.user_id = auth.uid()
                )
            ELSE TRUE
        END
    );

CREATE POLICY "Authenticated users can create activities" ON public.activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert default teams for Vismotor Corporation
INSERT INTO public.teams (name, description, color) VALUES
    ('Engineering', 'Product development and technical operations', '#3B82F6'),
    ('Marketing', 'Brand, communications, and growth initiatives', '#EC4899'),
    ('Sales', 'Revenue generation and client relationships', '#10B981'),
    ('Human Resources', 'People operations and talent management', '#8B5CF6'),
    ('Finance', 'Financial planning and accounting', '#F59E0B'),
    ('Operations', 'Business processes and logistics', '#06B6D4');
