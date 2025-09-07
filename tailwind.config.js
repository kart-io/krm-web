/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kubernetes: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#326ce5', // Kubernetes blue
          600: '#1e3a8a',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3a8a',
        }
      },
      fontSize: {
        // 统一字体大小配置
        'app-xs': ['0.625rem', { lineHeight: '0.875rem' }],    // 10px - badges, small tags
        'app-sm': ['0.75rem', { lineHeight: '1rem' }],         // 12px - menu items, labels
        'app-base': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px - card titles, content
        'app-lg': ['1rem', { lineHeight: '1.5rem' }],          // 16px - section headers
        'app-xl': ['1.125rem', { lineHeight: '1.75rem' }],     // 18px - modal titles
        'app-2xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px - page titles
        'app-3xl': ['1.5rem', { lineHeight: '2rem' }],         // 24px - main headers
      },
      screens: {
        'xs': '480px',
      }
    },
  },
  plugins: [],
}