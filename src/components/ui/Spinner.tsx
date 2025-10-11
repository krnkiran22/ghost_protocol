import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'text-stone-600',
        primary: 'text-accent-gold',
        white: 'text-white',
        ghost: 'text-ghost',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Loading text to display alongside spinner
   */
  text?: string;
}

/**
 * Loading Spinner component
 */
export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size,
  variant,
  text,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)} {...props}>
      <div className={cn(spinnerVariants({ size, variant }))} />
      {text && (
        <span className="text-sm text-stone-600">
          {text}
        </span>
      )}
    </div>
  );
};

/**
 * Loading Overlay - Full screen/container loading state
 */
export interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
  absolute?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Loading...',
  className,
  absolute = false,
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-center bg-white/80 backdrop-blur-sm z-50',
        absolute ? 'absolute inset-0' : 'fixed inset-0',
        className
      )}
    >
      <div className="text-center">
        <Spinner size="xl" variant="primary" />
        <p className="mt-4 text-base font-medium text-stone-900">
          {text}
        </p>
      </div>
    </div>
  );
};

Spinner.displayName = 'Spinner';
LoadingOverlay.displayName = 'LoadingOverlay';