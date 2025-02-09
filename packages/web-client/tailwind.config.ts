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
        brand: {
          light: "#cffafe", // お好みのブランドカラー（薄）
          DEFAULT: "#06b6d4", // メインブランドカラー
          dark: "#0891b2", // お好みのブランドカラー（濃）
        },
      },
      boxShadow: {
        card: "0 4px 8px rgba(0,0,0,0.08)",
        cardHover: "0 6px 12px rgba(0,0,0,0.12)",
      },
      fontSize: {
        "2xs": "0.675rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
