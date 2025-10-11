import { type Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neutral Base (Warm grays inspired by aged paper)
        background: {
          primary: '#FAFAF9',      // stone-50
          secondary: '#F5F5F4',    // stone-100
          tertiary: '#E7E5E4',     // stone-200
          dark: '#1C1917',         // stone-900
          elevated: '#292524',     // stone-800
        },
        
        // Accent Colors (Inspired by vintage ink & gold leaf)
        accent: {
          gold: '#D4AF37',         // Vintage gold
          'gold-light': '#E5C158',
          'gold-dark': '#B8941F',
          bronze: '#CD7F32',       // Bronze
          sepia: '#704214',        // Deep brown
          cream: '#FFF8E7',        // Cream
        },
        
        // Ghost Wallet Specific
        ghost: {
          DEFAULT: '#44403C',      // stone-700
          glow: '#D4AF37',         // Gold glow
          ethereal: '#E7E5E4',     // stone-200
        },
        
        // Blockchain/Tech Elements
        blockchain: {
          node: '#78716C',         // stone-500
          edge: '#D6D3D1',         // stone-300
          active: '#D4AF37',       // Gold
        },
        
        // Semantic colors
        semantic: {
          success: '#15803D',      // green-700
          warning: '#CA8A04',      // yellow-700
          error: '#B91C1C',        // red-700
          info: '#1E40AF',         // blue-800
        },
      },
      
      fontFamily: {
        sans: [
          '-apple-system', 
          'BlinkMacSystemFont', 
          '"SF Pro Display"', 
          '"SF Pro Text"', 
          'system-ui', 
          'sans-serif'
        ],
        mono: [
          '"SF Mono"', 
          'ui-monospace', 
          'SFMono-Regular', 
          'Menlo', 
          'Monaco', 
          'Consolas', 
          'monospace'
        ],
      },
      
      fontSize: {
        // Display sizes (Hero sections)
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],    // 72px
        'display-md': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],   // 60px
        'display-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],      // 48px
        
        // Custom line heights for better typography
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],    // 18px
        'body': ['1rem', { lineHeight: '1.5' }],            // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],     // 14px
      },
      
      boxShadow: {
        'glow': '0 0 20px rgba(212, 175, 55, 0.4)',
        'ghost-glow': '0 0 30px rgba(212, 175, 55, 0.3)',
        'ethereal': '0 0 40px rgba(212, 175, 55, 0.2)',
      },
      
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.8s ease-out',
        'slide-in-left': 'slide-in-left 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.6s ease-out',
      },
      
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '0.2',
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0px)',
          },
        },
        'slide-in-left': {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-30px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0px)',
          },
        },
        'slide-in-right': {
          '0%': { 
            opacity: '0',
            transform: 'translateX(30px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0px)',
          },
        },
      },
      
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
      },
      
      borderRadius: {
        'xl': '1rem',      // 16px
        '2xl': '1.5rem',   // 24px
        '3xl': '2rem',     // 32px
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;