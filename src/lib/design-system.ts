// Design system types and constants

export const colors = {
  // Neutral Base
  background: {
    primary: '#FAFAF9',      // stone-50
    secondary: '#F5F5F4',    // stone-100
    tertiary: '#E7E5E4',     // stone-200
    dark: '#1C1917',         // stone-900
    darkElevated: '#292524', // stone-800
  },
  
  // Accent Colors
  accent: {
    gold: '#D4AF37',
    goldLight: '#E5C158',
    goldDark: '#B8941F',
    bronze: '#CD7F32',
    sepia: '#704214',
    cream: '#FFF8E7',
  },
  
  // Text Colors
  text: {
    primary: '#1C1917',      // stone-900
    secondary: '#57534E',    // stone-600
    tertiary: '#78716C',     // stone-500
    inverse: '#FAFAF9',      // white on dark
    muted: '#A8A29E',        // stone-400
  },
  
  // Ghost Specific
  ghost: {
    primary: '#44403C',      // stone-700
    glow: '#D4AF37',
    ethereal: '#E7E5E4',
  },
  
  // Semantic Colors
  semantic: {
    success: '#15803D',      // green-700
    warning: '#CA8A04',      // yellow-700
    error: '#B91C1C',        // red-700
    info: '#1E40AF',         // blue-800
  },
} as const;

export const typography = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
    mono: '"SF Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  
  fontSize: {
    // Display
    displayLarge: '4.5rem',     // 72px
    displayMedium: '3.75rem',   // 60px
    displaySmall: '3rem',       // 48px
    
    // Headings
    h1: '2.25rem',              // 36px
    h2: '1.875rem',             // 30px
    h3: '1.5rem',               // 24px
    h4: '1.25rem',              // 20px
    h5: '1.125rem',             // 18px
    
    // Body
    bodyLarge: '1.125rem',      // 18px
    body: '1rem',               // 16px
    bodySmall: '0.875rem',      // 14px
    
    // UI
    caption: '0.75rem',         // 12px
    overline: '0.6875rem',      // 11px
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    heavy: 800,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.025em',
  },
} as const;

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(28, 25, 23, 0.05)',
  md: '0 4px 6px -1px rgba(28, 25, 23, 0.08), 0 2px 4px -1px rgba(28, 25, 23, 0.04)',
  lg: '0 10px 15px -3px rgba(28, 25, 23, 0.1), 0 4px 6px -2px rgba(28, 25, 23, 0.05)',
  xl: '0 20px 25px -5px rgba(28, 25, 23, 0.12), 0 10px 10px -5px rgba(28, 25, 23, 0.04)',
  '2xl': '0 25px 50px -12px rgba(28, 25, 23, 0.25)',
  
  // Special effects
  glow: '0 0 20px rgba(212, 175, 55, 0.4)',
  ghostGlow: '0 0 30px rgba(212, 175, 55, 0.3)',
  ethereal: '0 0 40px rgba(212, 175, 55, 0.2)',
  inner: 'inset 0 2px 4px 0 rgba(28, 25, 23, 0.06)',
} as const;

// Type definitions for component props
export type ColorVariant = 
  | 'primary' 
  | 'secondary' 
  | 'ghost' 
  | 'danger' 
  | 'gold' 
  | 'success' 
  | 'warning' 
  | 'info';

export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant = ColorVariant | 'outline' | 'link';

export type CardVariant = 'elevated' | 'outlined' | 'ghost' | 'premium';

export type BadgeVariant = ColorVariant | 'premium' | 'default';

// Utility type for component base props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Animation variants for Framer Motion
export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
} as const;