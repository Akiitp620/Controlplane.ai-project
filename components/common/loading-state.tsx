import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({
  label = 'Loading...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
