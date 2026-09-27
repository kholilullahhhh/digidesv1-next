import { Badge } from '@/components/ui/badge';
import { APPLICATION_STATUS_LABELS } from '@/lib/labels';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  SUBMITTED: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  VERIFIED: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  PROCESSING: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  REVISION: 'border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-300',
  COMPLETED: 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300',
  REJECTED: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
};

export function ApplicationStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn('whitespace-nowrap', STATUS_STYLES[status] ?? '')}>
      {APPLICATION_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
