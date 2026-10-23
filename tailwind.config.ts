/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#7f5af0",
          600: "#6d28d9",
          900: "#1e1b4b",
        },
        secondary: {
          400: "#00d9ff",
          500: "#00bcd4",
        },
        dark: {
          100: "#1a1a2e",
          200: "#16213e",
          300: "#0f172a",
          400: "#0a0a1a",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cyber-gradient": "linear-gradient(135deg, #7f5af0 0%, #00d9ff 100%)",
        "cyber-gradient-dark": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            opacity: 1,
            boxShadow: "0 0 20px rgba(127, 90, 240, 0.4)",
          },
          "50%": {
            opacity: 0.8,
            boxShadow: "0 0 40px rgba(127, 90, 240, 0.8)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(127, 90, 240, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(127, 90, 240, 0.6)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
