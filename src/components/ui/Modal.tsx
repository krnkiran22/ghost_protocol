import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Function to close the modal
   */
  onClose: () => void;
  /**
   * Modal title
   */
  title?: string;
  /**
   * Modal description/subtitle
   */
  description?: string;
  /**
   * Modal size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Whether clicking the backdrop should close the modal
   */
  closeOnBackdropClick?: boolean;
  /**
   * Whether pressing Escape should close the modal
   */
  closeOnEscape?: boolean;
  /**
   * Custom header content
   */
  header?: React.ReactNode;
  /**
   * Custom footer content
   */
  footer?: React.ReactNode;
  /**
   * Additional class names for the modal content
   */
  className?: string;
  /**
   * Modal content
   */
  children: React.ReactNode;
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full mx-4',
};

/**
 * Modal component with backdrop, animations, and accessibility features
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
 *   <p>Are you sure you want to continue?</p>
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  header,
  footer,
  className,
  children,
}) => {
  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-sm"
            onClick={closeOnBackdropClick ? onClose : undefined}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn(
                'relative w-full rounded-2xl bg-white shadow-2xl',
                modalSizes[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 transition-colors"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              )}

              {/* Header */}
              {(header || title || description) && (
                <div className="border-b border-stone-200 px-8 py-6">
                  {header || (
                    <div>
                      {title && (
                        <h2 className="text-2xl font-semibold text-stone-900 mb-2">
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p className="text-base text-stone-600">
                          {description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="px-8 py-6">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="border-t border-stone-200 px-8 py-6 flex items-center justify-end gap-3">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Render in portal
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

/**
 * Confirmation Modal - Pre-configured modal for confirmations
 */
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}) => {
  const confirmVariant = variant === 'danger' ? 'danger' : variant === 'warning' ? 'warning' : 'primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div></div>
    </Modal>
  );
};

/**
 * Success Modal - Pre-configured modal for success messages
 */
export interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  actionText = 'Continue',
  onAction,
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className="text-center"
    >
      {/* Success Icon */}
      <div className="mx-auto w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-semantic-success"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-stone-900 mb-4">
        {title}
      </h2>

      {description && (
        <p className="text-base text-stone-600 mb-6">
          {description}
        </p>
      )}

      {children}

      <div className="mt-8 flex gap-3 justify-center">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        {onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </Modal>
  );
};

Modal.displayName = 'Modal';
ConfirmModal.displayName = 'ConfirmModal';
SuccessModal.displayName = 'SuccessModal';