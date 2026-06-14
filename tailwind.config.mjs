/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background:         "var(--background)",
        foreground:         "var(--foreground)",
        card:               { DEFAULT: "var(--card)", foreground: "var(--card-foreground)" },
        popover:            { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)" },
        primary:            { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        secondary:          { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)" },
        muted:              { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)" },
        accent:             { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)" },
        destructive:        { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)" },
        border:             "var(--border)",
        input:              "var(--input)",
        ring:               "var(--ring)",
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "marquee-scroll": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "marquee-scroll":  "marquee-scroll 28s linear infinite",
        "fade-up":         "fade-up 0.55s ease forwards",
        "accordion-down":  "accordion-down 0.2s ease-out",
        "accordion-up":    "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};
