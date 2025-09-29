/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
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
          "white-off": "#FFFAFA",   // Use kebab-case for consistency
        }
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
}