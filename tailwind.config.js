/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0E14",
        panel: "#12151F",
        border: "#232838",
        coral: "#FF4D6D",
        amber: "#FFC24B",
        violet: "#8B7CFA",
        ivory: "#F2F0EA",
        mist: "#9AA1B4",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
