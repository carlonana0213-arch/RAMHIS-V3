/** @type {import('tailwindcss').Config} */

import { colors } from "./src/Theme/colors.js";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        success: colors.success,
        warning: colors.warning,
        danger: colors.danger,
        background: colors.background,
        surface: colors.surface,
        text: colors.text,
        border: colors.border,
        status: colors.status,
      },

      backgroundImage: {
        "clinical-gradient": `linear-gradient(
          135deg,
          ${colors.background.gradient.from} 0%,
          ${colors.background.gradient.via} 50%,
          ${colors.background.gradient.to} 100%
        )`,
      },
    },
  },

  plugins: [],
};