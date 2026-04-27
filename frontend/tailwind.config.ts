import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d0d0d",
        bone: "#f6f3ee",
        ruby: "#8a1717",
        brass: "#b08a4a",
      },
      fontFamily: {
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.18em",
        widest2: "0.32em",
      },
    },
  },
  plugins: [],
} satisfies Config;
