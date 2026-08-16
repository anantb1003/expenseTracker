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
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.07)',
        'glass-md': '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
        'glass-lg': '0 16px 48px 0 rgba(31, 38, 135, 0.18)',
        'glass-specular': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), 0 20px 40px -15px rgba(0, 0, 0, 0.4)',
        'glass-specular-dark': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        'glow-indigo': '0 0 35px -5px rgba(99, 102, 241, 0.5)',
        'glow-purple': '0 0 35px -5px rgba(168, 85, 247, 0.5)',
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.5)',
        'glow-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.5)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        pulseMesh: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.12)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1)',
        'pulse-mesh': 'pulseMesh 8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
