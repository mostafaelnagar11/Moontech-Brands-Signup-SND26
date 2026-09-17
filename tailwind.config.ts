import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-figtree)", "system-ui", "sans-serif"] },
      colors: {
        brand: { DEFAULT: "#4D2FB0", dark: "#3F2596", light: "#7C5CE0", ink: "#191234" },
        snd: { green: "#008849", greenDark: "#00713C", teal: "#003439", mint: "#8ADCB2", lime: "#5ABA1C" },
      },
    },
  },
  plugins: [],
};
export default config;
