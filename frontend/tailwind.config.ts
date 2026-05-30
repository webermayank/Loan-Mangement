import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102033',
        muted: '#667085',
        line: '#E5EAF2',
        paper: '#F7F9FC',
        brand: {
          50: '#EEF6FF',
          100: '#D9EBFF',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        mint: '#10B981',
        amber: '#F59E0B',
        rose: '#F43F5E',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(16, 32, 51, 0.10)',
        card: '0 10px 30px rgba(16, 32, 51, 0.07)',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.35rem' }],
        sm: ['0.9375rem', { lineHeight: '1.55rem' }],
        base: ['1rem', { lineHeight: '1.65rem' }],
        lg: ['1.125rem', { lineHeight: '1.85rem' }],
        xl: ['1.25rem', { lineHeight: '1.9rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.35rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.65rem' }],
        '5xl': ['3rem', { lineHeight: '1.08' }],
        '6xl': ['3.75rem', { lineHeight: '1.04' }],
        '7xl': ['4.5rem', { lineHeight: '1.02' }],
      },
    },
  },
  plugins: [],
};

export default config;
