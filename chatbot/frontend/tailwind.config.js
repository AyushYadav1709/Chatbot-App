/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        white: "#FFFFFF",
        black: "#000000",
        brown: "#222831",
        coffee: "#393E46",
        beige: "#00ADB5",
        cream: "#EEEEEE",
        c869999: "#869999",
        red: "#FF0000",
        gray: "#808080",
      },
      fontFamily: {
        lora: ["Lora", "serif"],
        oswald: ["Oswald", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};
