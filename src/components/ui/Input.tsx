import React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  // Base styles
  'flex w-full rounded-lg border bg-white px-4 py-3 text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 
          'border-stone-300 focus-visible:ring-accent-gold focus-visible:border-accent-gold',
        error: 
          'border-semantic-error focus-visible:ring-semantic-error focus-visible:border-semantic-error',
        success: 
          'border-semantic-success focus-visible:ring-semantic-success focus-visible:border-semantic-success',
        premium: 
          'border-accent-gold bg-accent-cream focus-visible:ring-accent-gold focus-visible:border-accent-gold-dark',
      },
      size: {
        sm: 'h-9 px-3 py-2 text-sm',
        md: 'h-12 px-4 py-3 text-base',
        lg: 'h-14 px-5 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'text-stone-700',
        error: 'text-semantic-error',
        success: 'text-semantic-success',
        premium: 'text-accent-gold-dark',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Label text for the input
   */
  label?: string;
  /**
   * Helper text displayed below the input
   */
  hint?: string;
  /**
   * Error message - when provided, input will show error state
   */
  error?: string;
  /**
   * Success message - when provided, input will show success state
   */
  success?: string;
  /**
   * Icon to display on the left side of input
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display on the right side of input
   */
  rightIcon?: React.ReactNode;
  /**
   * For password inputs, shows toggle visibility button
   */
  showPasswordToggle?: boolean;
}

/**
 * Input component with label, validation states, and icons
 * 
 * @example
 * <Input
 *   label="Email Address"
 *   placeholder="Enter your email"
 *   error={errors.email?.message}
 *   leftIcon={<Mail className="h-4 w-4" />}
 * />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = 'text',
      label,
      hint,
      error,
      success,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id || React.useId();
    
    // Determine variant based on error/success state
    const inputVariant = error ? 'error' : success ? 'success' : variant;
    const labelVariant = error ? 'error' : success ? 'success' : variant;

    // Handle password visibility toggle
    const inputType = type === 'password' && showPassword ? 'text' : type;
    const hasRightIcon = rightIcon || (type === 'password' && showPasswordToggle);

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(labelVariants({ variant: labelVariant }))}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={cn(
              inputVariants({ variant: inputVariant, size, className }),
              leftIcon && 'pl-10',
              hasRightIcon && 'pr-10',
              type === 'password' && showPasswordToggle && 'pr-10'
            )}
            {...props}
          />

          {/* Right Icon or Password Toggle */}
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {type === 'password' && showPasswordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-stone-500 hover:text-stone-700 focus:outline-none focus:text-stone-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <div className="text-stone-500">{rightIcon}</div>
              )}
            </div>
          )}
        </div>

        {/* Hint/Error/Success Message */}
        {(hint || error || success) && (
          <div className="flex items-start gap-1">
            {error && <AlertCircle className="h-4 w-4 text-semantic-error mt-0.5 flex-shrink-0" />}
            <p
              className={cn(
                'text-xs',
                error && 'text-semantic-error',
                success && 'text-semantic-success',
                !error && !success && 'text-stone-500'
              )}
            >
              {error || success || hint}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * Textarea component with similar styling to Input
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  variant?: 'default' | 'error' | 'success' | 'premium';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      hint,
      error,
      success,
      variant = 'default',
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const textareaVariant = error ? 'error' : success ? 'success' : variant;
    const labelVariant = error ? 'error' : success ? 'success' : variant;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(labelVariants({ variant: labelVariant }))}
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'flex min-h-[120px] w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-base transition-all duration-200 placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold focus-visible:ring-offset-2 focus-visible:border-accent-gold disabled:cursor-not-allowed disabled:opacity-50 resize-y',
            textareaVariant === 'error' && 'border-semantic-error focus-visible:ring-semantic-error focus-visible:border-semantic-error',
            textareaVariant === 'success' && 'border-semantic-success focus-visible:ring-semantic-success focus-visible:border-semantic-success',
            textareaVariant === 'premium' && 'border-accent-gold bg-accent-cream focus-visible:ring-accent-gold focus-visible:border-accent-gold-dark',
            className
          )}
          {...props}
        />

        {(hint || error || success) && (
          <div className="flex items-start gap-1">
            {error && <AlertCircle className="h-4 w-4 text-semantic-error mt-0.5 flex-shrink-0" />}
            <p
              className={cn(
                'text-xs',
                error && 'text-semantic-error',
                success && 'text-semantic-success',
                !error && !success && 'text-stone-500'
              )}
            >
              {error || success || hint}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';