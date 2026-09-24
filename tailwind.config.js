/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        osu: {
          blue: '#1e3a8a',
          navy: '#0f172a',
          gold: '#f59e0b',
          accent: '#2563eb',
          light: '#f8fafc',
        }
      }
    },
  },
  plugins: [],
}
