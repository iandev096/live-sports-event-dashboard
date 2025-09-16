/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#111827",
        panel: "rgba(31,41,55,0.5)",
        textPrimary: "#F9FAFB",
        textSecondary: "#9CA3AF",
        accent: "#3B82F6",
        success: "#10B981",
        warning: "#F59E0B",
      },
      fontFamily: {
        inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 4px 20px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
