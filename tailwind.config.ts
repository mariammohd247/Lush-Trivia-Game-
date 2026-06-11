import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ["var(--font-fredoka)", "sans-serif"],
      },
      colors: {
        cream: "#FFFBF0",
        ink: "#2D2D2D",
        med: { DEFAULT: "#0096C7", light: "#E0F7FF", dark: "#006D94" },
        ind: { DEFAULT: "#E85D04", light: "#FFF3E6", dark: "#B84800" },
        asi: { DEFAULT: "#D90429", light: "#FFE8EC", dark: "#A00020" },
        ita: { DEFAULT: "#386641", light: "#E8F5E3", dark: "#244428" },
      },
      animation: {
        "float-slow": "float 4s ease-in-out infinite",
        "float-med": "float 3s ease-in-out infinite",
        "float-fast": "float 2.5s ease-in-out infinite",
        shake: "shake 0.5s ease-in-out",
        "correct-pop": "correctPop 0.45s ease-out",
        "bounce-in": "bounceIn 0.4s ease-out",
        "spin-slow": "spin 8s linear infinite",
        wiggle: "wiggle 0.3s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(6deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "20%": { transform: "translateX(-9px) rotate(-2deg)" },
          "40%": { transform: "translateX(9px) rotate(2deg)" },
          "60%": { transform: "translateX(-6px) rotate(-1deg)" },
          "80%": { transform: "translateX(6px) rotate(1deg)" },
        },
        correctPop: {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.07)" },
          "65%": { transform: "scale(0.97)" },
          "100%": { transform: "scale(1)" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
      boxShadow: {
        doodle: "4px 4px 0 #2D2D2D",
        "doodle-lg": "6px 6px 0 #2D2D2D",
        "doodle-sm": "2px 2px 0 #2D2D2D",
        "doodle-hover": "6px 8px 0 #2D2D2D",
      },
    },
  },
  plugins: [],
};

export default config;
