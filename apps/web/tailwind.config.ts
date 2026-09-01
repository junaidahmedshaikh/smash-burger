import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: {
            DEFAULT: '#E6392E',
            hover: '#CF2F25',
            dark: '#9E1B13',
            light: '#FF5A4F',
            glow: 'rgba(230, 57, 46, 0.35)',
          },
          yellow: {
            DEFAULT: '#FFA700',
            light: '#FFBC33',
            dark: '#C78200',
            glow: 'rgba(255, 167, 0, 0.3)',
          },
          cream: {
            DEFAULT: '#FAF6EF',
            muted: '#E6DFD1',
            dark: '#D4CBB8',
          },
          dark: {
            DEFAULT: '#09090B',
            surface: '#131316',
            elevated: '#1D1D22',
            border: '#2A2A32',
            muted: '#71717A',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        'marquee-fast': 'marquee 15s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'brand-glow': '0 0 35px -5px rgba(230, 57, 46, 0.3)',
        'cheese-glow': '0 0 35px -5px rgba(255, 167, 0, 0.3)',
        'surface-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
