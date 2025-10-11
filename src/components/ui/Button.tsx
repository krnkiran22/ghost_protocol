import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold text-base transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 
          'bg-gradient-to-r from-accent-gold to-accent-gold-dark text-stone-900 shadow-md hover:shadow-glow hover:scale-105 active:scale-95',
        secondary: 
          'bg-transparent border-2 border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400',
        ghost: 
          'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100',
        danger: 
          'bg-semantic-error text-white hover:bg-red-800 shadow-md',
        gold: 
          'bg-accent-gold text-stone-900 hover:bg-accent-gold-dark shadow-md hover:shadow-glow hover:scale-105 active:scale-95',
        outline: 
          'bg-transparent border-2 border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-stone-900',
        link: 
          'bg-transparent text-accent-gold underline-offset-4 hover:underline p-0 h-auto',
        success: 
          'bg-semantic-success text-white hover:bg-green-800 shadow-md',
        warning: 
          'bg-semantic-warning text-white hover:bg-yellow-800 shadow-md',
        info: 
          'bg-semantic-info text-white hover:bg-blue-900 shadow-md',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        xl: 'h-16 px-10 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, the button will show a loading spinner and be disabled
   */
  loading?: boolean;
  /**
   * Icon to display before the button text
   */
  icon?: React.ReactNode;
  /**
   * Icon to display after the button text
   */
  iconRight?: React.ReactNode;
  /**
   * If true, the button will take the full width of its container
   */
  fullWidth?: boolean;
}

/**
 * Button component with multiple variants and states
 * 
 * @example
 * <Button variant="primary" size="lg" loading={isLoading}>
 *   Submit Form
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant, 
      size, 
      loading = false, 
      disabled,
      children, 
      icon,
      iconRight,
      fullWidth,
      ...props 
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && 'w-full'
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && icon && icon}
        {children}
        {!loading && iconRight && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';