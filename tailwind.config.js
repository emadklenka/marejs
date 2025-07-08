import daisyui from "daisyui";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{css}",
    "./index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4ade80",
          secondary: "#60a5fa",
          accent: "#f472b6",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
      "light",
      "dark",
    ],
  },
};
