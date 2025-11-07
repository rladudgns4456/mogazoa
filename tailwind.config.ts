import type { Config } from "tailwindcss";

import * as pxToRemModule from "tailwindcss-preset-px-to-rem";

const pxToRem = pxToRemModule.default ?? pxToRemModule;

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [pxToRem],
  theme: {
    extend: {
      fontFamily: {
        spoqa: ["Spoqa Han Sans Neo", "sans-serif"],
        cafe: ["Cafe24SuperMagic", "sans-serif"],
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      lineHeight: {
        DEFAULT: "1",
      },
      fontSize: {
        /*12px*/
        "12-light": ["0.75rem", { fontWeight: "300" }],
        "12-regular": ["0.75rem", { fontWeight: "400" }],
        "12-medium": ["0.75rem", { fontWeight: "500" }],
        "12-bold": ["0.75rem", { fontWeight: "700" }],

        /*14px*/
        "14-light": ["0.875rem", { fontWeight: "300" }],
        "14-regular": ["0.875rem", { fontWeight: "400" }],
        "14-medium": ["0.875rem", { fontWeight: "500" }],
        "14-bold": ["0.875rem", { fontWeight: "700" }],

        /*16px*/
        "16-light": ["1rem", { fontWeight: "300" }],
        "16-regular": ["1rem", { fontWeight: "400" }],
        "16-medium": ["1rem", { fontWeight: "500" }],
        "16-bold": ["1rem", { fontWeight: "700" }],

        /*18px*/
        "18-light": ["1.125rem", { fontWeight: "300" }],
        "18-regular": ["1.125rem", { fontWeight: "400" }],
        "18-medium": ["1.125rem", { fontWeight: "500" }],
        "18-bold": ["1.125rem", { fontWeight: "700" }],

        /*20px*/
        "20-regular": ["1.25rem", { fontWeight: "400" }],
        "20-bold": ["1.25rem", { fontWeight: "700" }],

        /*24px*/
        "24-regular": ["1.5rem", { fontWeight: "400" }],
        "24-bold": ["1.5rem", { fontWeight: "700" }],

        /*28px*/
        "28-regular": ["1.75rem", { fontWeight: "400" }],
        "28-bold": ["1.75rem", { fontWeight: "700" }],

        /*32px*/
        "32-regular": ["2rem", { fontWeight: "400" }],
        "32-bold": ["2rem", { fontWeight: "700" }],

        /*40px*/
        "40-bold": ["2.5rem", { fontWeight: "700" }],
      },
      colors: {
        white: "var(--white)",
        black: "var(--black)",
        error: "var(--error)",
        primary: {
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        gray: {
          100: "var(--gray-100)",
          200: "var(--gray-200)",
          300: "var(--gray-300)",
          400: "var(--gray-400)",
          500: "var(--gray-500)",
          600: "var(--gray-600)",
          700: "var(--gray-700)",
          800: "var(--gray-800)",
          900: "var(--gray-900)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
