import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'mobile': {'max': '450px'},  // Custom mobile breakpoint at 400px
        'sm': '640px',               // Default 'sm' breakpoint for >= 640px
        'md': '768px',               // Default 'md' breakpoint for >= 768px
        'lg': '1024px',              // Default 'lg' breakpoint for >= 1024px
        'xl': '1280px',              // Default 'xl' breakpoint for >= 1280px
        '2xl': '1536px',             // Default '2xl' breakpoint for >= 1536px
      },
    },
  },
  plugins: [],
} satisfies Config;
