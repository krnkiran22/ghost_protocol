import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  // Base styles
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-stone-200 text-stone-800 hover:bg-stone-300',
        primary:
          'border-transparent bg-accent-gold text-stone-900 hover:bg-accent-gold-dark',
        secondary:
          'border-transparent bg-stone-700 text-stone-100 hover:bg-stone-800',
        ghost:
          'border-transparent bg-ghost/10 text-ghost hover:bg-ghost/20',
        danger:
          'border-transparent bg-semantic-error text-white hover:bg-red-800',
        success:
          'border-transparent bg-semantic-success text-white hover:bg-green-800',
        warning:
          'border-transparent bg-semantic-warning text-white hover:bg-yellow-800',
        info:
          'border-transparent bg-semantic-info text-white hover:bg-blue-900',
        gold:
          'border-transparent bg-accent-gold text-stone-900 hover:bg-accent-gold-dark shadow-glow',
        premium:
          'border-accent-gold bg-accent-cream text-accent-gold-dark hover:bg-accent-gold hover:text-stone-900',
        outline:
          'border-stone-300 bg-transparent text-stone-700 hover:bg-stone-100',
        'outline-gold':
          'border-accent-gold bg-transparent text-accent-gold hover:bg-accent-gold hover:text-stone-900',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Icon to display before the badge text
   */
  icon?: React.ReactNode;
  /**
   * Icon to display after the badge text
   */
  iconRight?: React.ReactNode;
  /**
   * If true, badge will be removable with an X button
   */
  removable?: boolean;
  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;
}

/**
 * Badge component for status indicators, labels, and tags
 * 
 * @example
 * <Badge variant="premium" icon={<Crown className="h-3 w-3" />}>
 *   Premium IP
 * </Badge>
 */
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      iconRight,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
        {removable && (
          <button
            onClick={onRemove}
            className="ml-1 flex-shrink-0 rounded-full hover:bg-black/10 focus:outline-none focus:bg-black/10"
            type="button"
          >
            <svg
              className="h-3 w-3"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 8 8"
            >
              <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
            </svg>
            <span className="sr-only">Remove badge</span>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

/**
 * Status Badge - Specialized badge for IP Asset statuses
 */
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'pending' | 'disputed' | 'inactive' | 'ghost' | 'verified';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success' as const, text: 'Active' },
    pending: { variant: 'warning' as const, text: 'Pending' },
    disputed: { variant: 'danger' as const, text: 'Disputed' },
    inactive: { variant: 'default' as const, text: 'Inactive' },
    ghost: { variant: 'ghost' as const, text: 'Ghost Wallet' },
    verified: { variant: 'info' as const, text: 'Verified' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} {...props}>
      {config.text}
    </Badge>
  );
};

/**
 * Royalty Badge - Shows earnings/royalty information
 */
export interface RoyaltyBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  amount: number;
  currency?: 'USD' | 'STORY' | 'ETH';
  trend?: 'up' | 'down' | 'neutral';
}

export const RoyaltyBadge: React.FC<RoyaltyBadgeProps> = ({
  amount,
  currency = 'USD',
  trend,
  ...props
}) => {
  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    
    if (currency === 'STORY') {
      return `${amount.toLocaleString()} STORY`;
    }
    
    if (currency === 'ETH') {
      return `${amount.toFixed(4)} ETH`;
    }
    
    return amount.toString();
  };

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') {
      return (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (trend === 'down') {
      return (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return null;
  };

  const variant = amount > 0 ? 'gold' : 'default';

  return (
    <Badge
      variant={variant}
      icon={getTrendIcon(trend)}
      {...props}
    >
      {formatAmount(amount, currency)}
    </Badge>
  );
};

StatusBadge.displayName = 'StatusBadge';
RoyaltyBadge.displayName = 'RoyaltyBadge';