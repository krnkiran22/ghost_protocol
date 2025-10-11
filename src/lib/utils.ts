import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names with Tailwind CSS classes
 * Uses clsx for conditional classes and handles conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format currency values consistently across the app
 */
export function formatCurrency(
  amount: number, 
  currency: 'USD' | 'STORY' | 'ETH' = 'USD'
): string {
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
    return `${amount.toFixed(6)} ETH`;
  }
  
  return amount.toString();
}

/**
 * Format large numbers with appropriate suffixes (1K, 1M, 1B)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Truncate Ethereum addresses for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format percentage values consistently
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate time ago from a date
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - target.getTime();
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diffMs < minute) return 'just now';
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < week) return `${Math.floor(diffMs / day)}d ago`;
  if (diffMs < month) return `${Math.floor(diffMs / week)}w ago`;
  if (diffMs < year) return `${Math.floor(diffMs / month)}mo ago`;
  
  return `${Math.floor(diffMs / year)}y ago`;
}

/**
 * Debounce function for search and input handling
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a random ID for components
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a string is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Safe JSON parse that returns null on error
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File, 
  allowedTypes: string[], 
  maxSizeMB: number = 10
): { valid: boolean; error?: string } {
  // Check file type
  const fileType = file.type;
  const isValidType = allowedTypes.some(type => {
    if (type.endsWith('*')) {
      return fileType.startsWith(type.slice(0, -1));
    }
    return fileType === type;
  });
  
  if (!isValidType) {
    return {
      valid: false,
      error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  // Check file size
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`
    };
  }
  
  return { valid: true };
}