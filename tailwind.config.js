/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["DM Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#D2691E",
        secondary: "#8B4513",
        accent: "#FF6347",
        success: "#2E7D32",
        warning: "#F57C00",
        error: "#C62828",
        info: "#1976D2",
        surface: "#FFFFFF",
        background: "#F5F5F0",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 16px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};