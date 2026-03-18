'use client';

import { useRecentActivity } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  CheckCircle2, 
  PlusCircle, 
  MessageSquare, 
  Edit, 
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const actionIcons: Record<string, React.ElementType> = {
  created: PlusCircle,
  updated: Edit,
  deleted: Trash2,
  completed: CheckCircle2,
  commented: MessageSquare,
};

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {!activities || activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {activities.slice(0, 8).map((activity) => {
              const Icon = actionIcons[activity.action] || Edit;
              
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user?.full_name || 'Someone'}</span>
                      {' '}{activity.action}{' '}
                      <span className="text-muted-foreground">{activity.entity_type}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
