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
        // Brand palette
        primary: {
          50:  '#eef5ff',
          100: '#d9e9ff',
          200: '#bcd6ff',
          300: '#8ebcff',
          400: '#5a97ff',
          500: '#3a6efd',
          600: '#1e4af2',
          700: '#1638de',
          800: '#1830b3',
          900: '#192e8d',
          950: '#131f57',
        },
        medical: {
          red:    '#ef4444',
          green:  '#22c55e',
          blue:   '#3b82f6',
          purple: '#a855f7',
          orange: '#f97316',
          teal:   '#14b8a6',
        },
        glass: {
          white: 'rgba(255,255,255,0.15)',
          dark:  'rgba(0,0,0,0.25)',
        }
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-blue':       'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'mesh-medical':    'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0ea5e9 100%)',
        'hero-pattern':    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glass':    '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'card':     '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-md':  '0 8px 40px rgba(0, 0, 0, 0.10)',
        'card-lg':  '0 20px 60px rgba(0, 0, 0, 0.15)',
        'glow':     '0 0 20px rgba(58, 110, 253, 0.35)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in':      'fadeIn 0.4s ease-in-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'slide-right':  'slideRight 0.3s ease-out',
        'pulse-soft':   'pulseSoft 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':        'float 3s ease-in-out infinite',
        'shimmer':      'shimmer 1.5s linear infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' },                            '100%': { opacity: '1' } },
        slideUp:   { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideRight:{ '0%': { transform: 'translateX(-20px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        pulseSoft: { '0%,100%': { opacity: '1' },                       '50%': { opacity: '.7' } },
        float:     { '0%,100%': { transform: 'translateY(0)' },         '50%': { transform: 'translateY(-8px)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' },           '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
