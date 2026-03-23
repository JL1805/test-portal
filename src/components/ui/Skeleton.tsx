import { cn } from '../../utils/helpers';

interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Skeleton({ className = '', rounded = 'lg' }: SkeletonProps) {
  const roundedClasses: Record<string, string> = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'animate-shimmer',
        roundedClasses[rounded],
        className
      )}
      aria-hidden="true"
    />
  );
}

export function WelcomeSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-center">
        <Skeleton className="h-12 w-48" rounded="lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32 mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
      </div>
      <Skeleton className="h-32 w-full" rounded="2xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-48 mx-auto" />
        <div className="flex gap-2 justify-center">
          <Skeleton className="h-8 w-20 " rounded="full" />
          <Skeleton className="h-8 w-20" rounded="full" />
          <Skeleton className="h-8 w-20" rounded="full" />
        </div>
      </div>
      <Skeleton className="h-14 w-full" rounded="full" />
    </div>
  );
}
