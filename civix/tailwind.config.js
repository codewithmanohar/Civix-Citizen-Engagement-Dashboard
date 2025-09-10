/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter","ui-sans-serif","system-ui","Segoe UI","Roboto","Helvetica","Arial","Apple Color Emoji","Segoe UI Emoji"],
      },
      colors: {
        brand: {
          dark: "#0c2d48",
          primary: "#0a365a",
          accent: "#0b3c68",
          btn: "#0b3a64",
          light: "#cfeef9"
        },
        melon: "#ef6b2e"
      },
      boxShadow: {
        soft: "0 8px 20px rgba(2,33,68,0.08)"
      }
    },
  },
  plugins: [],
}
