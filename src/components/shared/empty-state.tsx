import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 py-20 text-center">
      <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-4">
        <Icon className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="font-bold text-sm font-headline">{title}</p>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
