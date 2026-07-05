import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#12172B",
        "ink-soft": "#4B5468",
        muted: "#8791A8",
        primary: {
          DEFAULT: "#4147E8",
          dark: "#2D31B8",
          light: "#EEF0FF",
        },
        secondary: {
          DEFAULT: "#FF7A45",
          light: "#FFEFE6",
        },
        success: {
          DEFAULT: "#16A76B",
          light: "#E8F9F1",
        },
        border: "#E7E9F2",
        subtle: "#F7F8FC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl2: "20px",
        xl3: "24px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(30,40,90,0.06), 0 12px 32px -8px rgba(30,40,90,0.10)",
        softer: "0 1px 3px rgba(30,40,90,0.05), 0 4px 12px -2px rgba(30,40,90,0.06)",
        glow: "0 0 0 1px rgba(65,71,232,0.08), 0 12px 40px -8px rgba(65,71,232,0.22)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(65,71,232,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(65,71,232,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(2deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-22px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(24px, -32px) scale(1.06)" },
          "66%": { transform: "translate(-18px, 18px) scale(0.96)" },
        },
        draw: {
          to: { strokeDashoffset: 0 },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 9s ease-in-out infinite",
        blob: "blob 14s ease-in-out infinite",
        draw: "draw 2.2s ease-out forwards",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;