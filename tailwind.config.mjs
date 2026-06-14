/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      colors: {
        brand: {
          50:  "#f0f4f5",
          100: "#dde7ea",
          200: "#bbd2d9",
          300: "#96aeba",
          400: "#728f9b",
          500: "#546E7A",
          600: "#476070",
          700: "#3a5260",
          800: "#2c4450",
          900: "#1e3640",
        },
        accent: {
          50:  "#fdfaf0",
          100: "#faf0d4",
          200: "#f3dea3",
          300: "#e9c66d",
          400: "#dcab44",
          500: "#c8911f",
          600: "#a8740f",
          700: "#855a0e",
          800: "#6c4912",
          900: "#5c3d14",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(84,110,122,0.06), 0 8px 24px -8px rgba(30,54,64,0.18)",
        "glow-lg": "0 0 0 1px rgba(84,110,122,0.06), 0 24px 48px -16px rgba(30,54,64,0.25)",
      },
    },
  },
  plugins: [],
};
