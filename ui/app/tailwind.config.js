module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        medical: {
          primary: "#1E3A8A",
          secondary: "#60A5FA",
          accent: "#10B981",
          dark: "#0F4C81",
          light: "#BFDBFE",
        },
      },
      backgroundImage: {
        "medical-gradient": "linear-gradient(135deg, #1E3A8A 0%, #0F4C81 100%)",
        "auth-gradient":
          "linear-gradient(to bottom right, #BFDBFE 0%, #FFFFFF 50%, #BFDBFE 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Calibre", "Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      boxShadow: {
        medical: "0 8px 32px rgba(31, 117, 239, 0.2)",
        "auth-card": "0 4px 24px rgba(0, 0, 0, 0.08)",
      },
      opacity: {
        15: "0.15",
        90: "0.90",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
