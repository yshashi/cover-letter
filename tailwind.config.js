/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  // Letter templates build accent classes at runtime via {{themeColor}},
  // so Tailwind's scanner can't see them — keep them generated explicitly.
  safelist: [
    { pattern: /^(text|bg|border)-accent-(50|100|200|500|600|700|800)$/ },
  ],
  theme: {
    extend: {
      colors: {
        border: '#e7e5e4',
        background: '#ffffff',
        foreground: '#292524',
        accent: {
          50: '#fef6f0',
          100: '#fdead9',
          200: '#fad3b3',
          300: '#f6b381',
          400: '#f0894e',
          500: '#e56f2f',
          600: '#d1571f',
          700: '#ad441a',
          800: '#8a381c',
          900: '#712f1a',
          950: '#3d160b',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-up': 'slideInUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
