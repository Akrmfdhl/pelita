/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          paper: "#F9F8F6",
          surface: "#FFFFFF",
          subtle: "#F3EFE6",
          border: "#E2DBD0",
        },
        ink: {
          primary: "#1A1F2C",
          muted: "#5A6474",
          navy: "#182238",
        },
        stamp: {
          red: "#C53030",
          'red-bg': "#FFF5F5",
          amber: "#DD6B20",
          'amber-bg': "#FFFAF0",
          teal: "#234E52",
          'teal-bg': "#E6FFFA",
        }
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
