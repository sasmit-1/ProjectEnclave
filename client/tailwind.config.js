/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        primary: '#2563eb',
        text: '#0f172a',
        muted: '#64748b',
        border: '#e2e8f0'
      },
      fontFamily: {
        sans: ['Calibri', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
