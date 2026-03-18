# Vismotor PM - Project Management Dashboard

A modern, full-featured project management dashboard built for **Vismotor Corporation**. Manage teams, projects, and tasks with an intuitive interface featuring Kanban boards, calendar views, and analytics.

## Features

- **Dashboard Overview**: Quick stats, recent activity, and tasks due soon
- **Team Management**: Create and manage teams with color coding and member roles
- **Project Management**: Track projects with status indicators and progress bars
- **Kanban Boards**: Drag-and-drop task management with multiple columns
- **Task Management**: Create, assign, and track tasks with priorities and due dates
- **Calendar View**: Visual calendar showing tasks and deadlines by date
- **Analytics Dashboard**: Charts and metrics for team productivity insights
- **Authentication**: Secure login/register with Supabase Auth
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project-management-dash
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the migration file in your Supabase SQL editor:
   - Navigate to `supabase/migrations/001_initial_schema.sql`
   - Copy the contents and run in Supabase SQL Editor

This will create:
- All required tables (profiles, teams, projects, tasks, comments, activities)
- Row Level Security policies
- Database functions and triggers
- Default teams for Vismotor Corporation

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/      # Protected dashboard pages
│   │   ├── page.tsx      # Dashboard overview
│   │   ├── teams/        # Team management
│   │   ├── projects/     # Project management & Kanban
│   │   ├── tasks/        # My Tasks view
│   │   ├── calendar/     # Calendar view
│   │   ├── analytics/    # Analytics dashboard
│   │   └── settings/     # User settings
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── teams/            # Team-related components
│   ├── projects/         # Project & Kanban components
│   ├── tasks/            # Task-related components
│   └── shared/           # Reusable components
├── hooks/                # Custom React hooks
├── lib/
│   ├── supabase/         # Supabase client configuration
│   ├── constants.ts      # App constants and routes
│   └── utils.ts          # Utility functions
├── store/                # Zustand state management
└── types/                # TypeScript type definitions
```

## Default Teams

The application comes pre-configured with teams for Vismotor Corporation:

- **Engineering** - Product development and technical operations
- **Marketing** - Brand, communications, and growth initiatives
- **Sales** - Revenue generation and client relationships
- **Human Resources** - People operations and talent management
- **Finance** - Financial planning and accounting
- **Operations** - Business processes and logistics

## Key Features Explained

### Kanban Board
- Drag and drop tasks between columns
- Columns: Backlog, To Do, In Progress, Review, Done
- Quick task creation from any column
- Visual priority indicators

### Task Priorities
- **Low** - Minimal urgency
- **Medium** - Normal priority
- **High** - Important tasks
- **Urgent** - Requires immediate attention

### Project Status
- **Planning** - In planning phase
- **In Progress** - Actively being worked on
- **On Hold** - Temporarily paused
- **Completed** - Finished

### Team Roles
- **Admin** - Full access, can manage team settings
- **Member** - Can create and manage tasks/projects
- **Viewer** - Read-only access

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## License

This project is proprietary software for Vismotor Corporation.

---

Built with Next.js, Supabase, and shadcn/ui
# project-management-dash
