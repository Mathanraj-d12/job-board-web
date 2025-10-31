/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2196f3',
          light: '#64b5f6',
          dark: '#1976d2',
        },
        secondary: {
          DEFAULT: '#ffffff',
        },
        background: {
          DEFAULT: '#ffffff',
          paper: '#f8fafc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        'hover': '0 6px 12px rgba(33, 150, 243, 0.25)',
        'card': '0 12px 24px rgba(33, 150, 243, 0.15)',
        'navbar': '0 4px 8px rgba(33, 150, 243, 0.15)',
      },
    },
  },
  plugins: [],
}