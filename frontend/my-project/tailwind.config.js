/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-btn': '#1D4ED8',      // your button color
        'brand-light': '#EFF6FF',    // background or light color
      },
      boxShadow: {
        'soft': '0 4px 10px rgba(0, 0, 0, 0.08)', // optional soft shadow
      },
    },
  },
  plugins: [],
}
