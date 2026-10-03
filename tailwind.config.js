/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sci: {
          dark: '#0b0f19',
          panel: '#151b2b',
          border: '#2a3441',
          accent: '#00f0ff',
          alert: '#ff2a2a',
          success: '#00ff88'
        }
      }
    },
  },
  plugins: [],
}
