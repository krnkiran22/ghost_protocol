import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  // Base styles
  'rounded-xl transition-all duration-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent-gold focus-within:ring-offset-2',
  {
    variants: {
      variant: {
        elevated: 
          'bg-white border border-stone-200 shadow-md hover:shadow-lg',
        outlined: 
          'bg-white border-2 border-stone-300 hover:border-stone-400',
        ghost: 
          'bg-stone-900/90 text-stone-100 backdrop-blur-xl border border-stone-700',
        premium: 
          'bg-white border border-stone-200 border-t-4 border-t-accent-gold shadow-md hover:shadow-xl',
        glass:
          'bg-white/80 backdrop-blur-md border border-stone-200/50 shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-12',
      },
      hoverable: {
        true: 'cursor-pointer hover:-translate-y-1',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'elevated',
      padding: 'md',
      hoverable: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Custom header content (rendered above children)
   */
  header?: React.ReactNode;
  /**
   * Custom footer content (rendered below children)
   */
  footer?: React.ReactNode;
  /**
   * Optional title for the card
   */
  title?: string;
  /**
   * Optional description/subtitle for the card
   */
  description?: string;
}

/**
 * Flexible Card component with multiple variants and states
 * 
 * @example
 * <Card variant="premium" hoverable>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      hoverable,
      header,
      footer,
      title,
      description,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hoverable, className }))}
        {...props}
      >
        {/* Header Section */}
        {(header || title || description) && (
          <div className={cn(
            'border-b border-stone-200 pb-4 mb-6',
            padding === 'none' && 'px-6 pt-6',
            !children && 'border-b-0 pb-0 mb-0'
          )}>
            {header}
            {title && (
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-base text-stone-600">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Main Content */}
        {children && (
          <div className={cn(
            'flex-1',
            padding === 'none' && 'px-6'
          )}>
            {children}
          </div>
        )}

        {/* Footer Section */}
        {footer && (
          <div className={cn(
            'border-t border-stone-200 pt-4 mt-6',
            padding === 'none' && 'px-6 pb-6'
          )}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader - Dedicated header component for complex card layouts
 */
export const CardHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn('border-b border-stone-200 pb-4 mb-6', className)}>
    {children}
  </div>
);

/**
 * CardContent - Main content area component
 */
export const CardContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn('flex-1', className)}>
    {children}
  </div>
);

/**
 * CardFooter - Footer component for actions and additional info
 */
export const CardFooter: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn('border-t border-stone-200 pt-4 mt-6 flex items-center justify-between', className)}>
    {children}
  </div>
);

CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';