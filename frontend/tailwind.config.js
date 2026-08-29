/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        butter: {
          DEFAULT: "#FFEC89",
          light: "#FFF4B8",
          dark: "#F5DF6B",
        },
        rust: {
          DEFAULT: "#BA3801",
          hover: "#9A2E01",
          light: "rgba(186, 56, 1, 0.15)",
          border: "rgba(186, 56, 1, 0.35)",
        },
        navy: {
          DEFAULT: "#4A69B3",
          dark: "#1E2C4F",
          card: "#2A3A63",
          muted: "#2E3E6E",
          light: "#6884C7",
          border: "rgba(74, 105, 179, 0.35)",
        },
        status: {
          emerald: "#10B981",
          'emerald-bg': "#ECFDF5",
          'emerald-border': "#A7F3D0",
          crimson: "#EF4444",
          'crimson-bg': "#FEF2F2",
          'crimson-border': "#FECACA",
          amber: "#F59E0B",
          'amber-bg': "#FFFBEB",
          'amber-border': "#FDE68A",
        }
      },
      fontFamily: {
        display: ['"Inter Tight"', 'sans-serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Fira Code"', '"Geist Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
