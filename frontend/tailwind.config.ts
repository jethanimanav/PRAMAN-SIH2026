import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./features/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A1628",
        paper: "#F5F3EE",
        signal: "#1B7A6E",
        amber: "#C17A2E",
        critical: "#A33A3A",
        line: "#D8D3C7",
        mist: "#ECE9E1",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Inter", "Arial", "sans-serif"],
        mono: ["'IBM Plex Mono'", "Consolas", "monospace"],
      },
      borderRadius: {
        dossier: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
