/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: "#0bb0ed",
        "primary-light": "#6ccdea",
        "primary-lighter": "#a7e9f6",
        accent: "#10c4fa",
        "accent-light": "#ccf8fa",
        "background-light": "#f5fbfa",

        // Neutral / Gray Scale
        "gray-dark": "#a6a5a6",
        gray: "#b8b4b4",
        "gray-light": "#e5e5e5",
        "gray-lighter": "#f5f5f5",
        white: "#ffffff",
        black: "#000000",

        // Status Colors
        success: "#22c55e",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#3b82f6",

        // Text Colors
        "text-primary": "#000000",
        "text-secondary": "#a6a5a6",
        "text-muted": "#b8b4b4",

        // Border Colors
        "border-default": "#e5e5e5",
        "border-muted": "#f5f5f5",

        // Background Colors
        "bg-primary": "#0bb0ed",
        "bg-secondary": "#6ccdea",
        "bg-light": "#f5fbfa",
        "bg-muted": "#f5f5f5",
      },

      // Optional: gradients
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #0bb0ed, #10c4fa)",
        "gradient-light": "linear-gradient(135deg, #a7e9f6, #ccf8fa)",
      },
    },
  },
  plugins: [],
};
