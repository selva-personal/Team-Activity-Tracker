import React from 'react';
import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rectangular' }) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        {
          'rounded-full': variant === 'circular',
          'rounded': variant === 'rectangular',
          'rounded-md': variant === 'text',
        },
        className
      )}
    />
  );
};
