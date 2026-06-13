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
      },
    },
  },
  plugins: [],
};
