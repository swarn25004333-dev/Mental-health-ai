/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand — blue/violet glassmorphism palette
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Violet accent
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Indigo
        indigo: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Teal accent (kept for mood/wellness context)
        teal: {
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        // Deep dark background palette
        dark: {
          950: '#030712',
          900: '#070b14',
          800: '#0d1117',
          700: '#111827',
          600: '#1a2234',
          500: '#1e293b',
          400: '#253047',
          border: 'rgba(255,255,255,0.08)',
          'border-soft': 'rgba(255,255,255,0.05)',
          text: '#e2e8f0',
          muted: '#64748b',
          subtle: '#94a3b8',
        },
        // Glass surface tokens
        glass: {
          '1': 'rgba(255,255,255,0.03)',
          '2': 'rgba(255,255,255,0.05)',
          '3': 'rgba(255,255,255,0.07)',
          '4': 'rgba(255,255,255,0.10)',
          'border': 'rgba(255,255,255,0.08)',
          'border-strong': 'rgba(255,255,255,0.15)',
        },
        // Status colors
        success: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          950: '#1a0010',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
          950: '#1a1000',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          950: '#001a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        // Gradient backgrounds
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'brand-gradient': 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        'brand-gradient-hover': 'linear-gradient(135deg, #2563eb, #7c3aed)',
        'ambient-gradient': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.08), transparent), radial-gradient(ellipse 60% 80% at 90% 80%, rgba(139,92,246,0.06), transparent)',
      },
      boxShadow: {
        // Glow shadows for glass components
        'glow-sm':    '0 0 15px rgba(59, 130, 246, 0.12)',
        'glow':       '0 0 25px rgba(59, 130, 246, 0.15)',
        'glow-lg':    '0 0 40px rgba(59, 130, 246, 0.2)',
        'glow-violet':'0 0 25px rgba(139, 92, 246, 0.2)',
        'glow-brand': '0 0 30px rgba(99, 102, 241, 0.2)',
        'glow-rose':  '0 0 20px rgba(244, 63, 94, 0.2)',
        'glow-emerald':'0 0 20px rgba(16, 185, 129, 0.2)',
        // Glass card shadows
        'glass-sm':   '0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'glass':      '0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        'glass-lg':   '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        'glass-xl':   '0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.10)',
        // Chat bubble shadows
        'chat-user':  '0 2px 12px rgba(59, 130, 246, 0.25)',
        'chat-ai':    '0 2px 8px rgba(0,0,0,0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '20px',
        '2xl': '40px',
      },
      keyframes: {
        // Entrance animations
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Ambient glow pulse for AI avatar
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(99,102,241,0.3), 0 0 30px rgba(59,130,246,0.15)' },
          '50%':      { boxShadow: '0 0 25px rgba(99,102,241,0.5), 0 0 50px rgba(59,130,246,0.25)' },
        },
        // Typing dots
        typingDot: {
          '0%, 60%, 100%': { opacity: '0.2', transform: 'translateY(0)' },
          '30%':            { opacity: '1',   transform: 'translateY(-4px)' },
        },
        // Shimmer for skeleton loading
        shimmer: {
          '0%':   { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
        // Float for ambient orbs
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%':      { transform: 'translateY(-20px) scale(1.05)' },
        },
      },
      animation: {
        'fadeInUp':    'fadeInUp 0.35s ease-out forwards',
        'fadeIn':      'fadeIn 0.25s ease-out forwards',
        'slideInLeft': 'slideInLeft 0.3s ease-out forwards',
        'slideInRight':'slideInRight 0.3s ease-out forwards',
        'scaleIn':     'scaleIn 0.25s ease-out forwards',
        'glowPulse':   'glowPulse 3s ease-in-out infinite',
        'typingDot':   'typingDot 1.4s ease-in-out infinite',
        'shimmer':     'shimmer 1.5s linear infinite',
        'float':       'float 6s ease-in-out infinite',
        'float-delay': 'float 8s ease-in-out 2s infinite',
      },
      transitionDuration: {
        '0': '0ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
