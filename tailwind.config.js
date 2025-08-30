/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-jp': ['Noto Sans JP', 'sans-serif'],
        'sans': ['Noto Sans JP', 'ui-sans-serif', 'system-ui'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'sans': ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        japan: {
          navy: "#1C2C5B",     // Primary Navy Indigo
          sakura: "#F7B7C4",   // Secondary Sakura Pink
          white: "#FFFFFF",    // Background White
          vermilion: "#E60026",// Accent Red
          softgrey: "#F5F5F5", // Neutral Grey
        }
      }
    },
  },
  plugins: [],
}