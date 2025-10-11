import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProgressProps {
  /**
   * Current step (0-based index)
   */
  currentStep: number;
  /**
   * Total number of steps
   */
  totalSteps: number;
  /**
   * Step labels
   */
  steps?: string[];
  /**
   * Variant style
   */
  variant?: 'default' | 'minimal';
  /**
   * Additional class names
   */
  className?: string;
}

/**
 * Progress component for multi-step flows
 */
export const Progress: React.FC<ProgressProps> = ({
  currentStep,
  totalSteps,
  steps,
  variant = 'default',
  className,
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  if (variant === 'minimal') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-stone-500">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-accent-gold to-accent-gold-dark rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Progress Bar */}
      <div className="relative mb-8">
        {/* Background Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-stone-200" />
        
        {/* Active Progress Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-accent-gold to-accent-gold-dark"
        />

        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={cn(
                  'relative w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-all duration-300',
                  {
                    // Completed step
                    'bg-accent-gold border-accent-gold text-stone-900 shadow-glow': isCompleted,
                    // Current step
                    'bg-accent-gold border-accent-gold text-stone-900 ring-4 ring-accent-gold/20 shadow-glow': isCurrent,
                    // Pending step
                    'bg-white border-stone-300 text-stone-500': isPending,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step Labels */}
      {steps && (
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={index}
                className="flex-1 text-center px-2"
              >
                <p
                  className={cn(
                    'text-sm font-medium transition-colors duration-300',
                    {
                      'text-accent-gold': isCompleted || isCurrent,
                      'text-stone-500': index > currentStep,
                    }
                  )}
                >
                  {step}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Simple Progress Bar component
 */
export interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  showLabel = false,
  label,
  variant = 'default',
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantStyles = {
    default: 'from-accent-gold to-accent-gold-dark',
    success: 'from-semantic-success to-green-600',
    warning: 'from-semantic-warning to-yellow-600',
    error: 'from-semantic-error to-red-600',
  };

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-stone-500">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full bg-gradient-to-r',
            variantStyles[variant]
          )}
        />
      </div>
    </div>
  );
};

Progress.displayName = 'Progress';
ProgressBar.displayName = 'ProgressBar';