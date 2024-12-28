/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "main": "#F6AE2D",
        "dark": "#1C1C1C",
        "less-dark": "#313131",
        "even-less-dark": "#3C3C3C",
        "even-even-less-dark": "#4C4C4C",
        "difficulty-easy": "#MediumSeaGreen",
        "difficulty-normal": "#59b0f4",
        "difficulty-hard": "#FF6347",
        "difficulty-insane": "#f6a",
        "difficulty-expert": "#bf2a42",
        "difficulty-expert-plus": "#8f48db",
      },
      fontFamily: {
        title: ["Noto Sans", "sans-serif"],
        mono: ["Roboto Mono", ...defaultTheme.fontFamily.mono],
      },
    },
    safelist: [
      {
        pattern: /difficulty-(easy|normal|hard|insane|expert|expert-plus)/,
      },
    ],
  },
  plugins: [],
}