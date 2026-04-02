/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // Teal color for Smart Campus feel
        secondary: "#334155",
        background: "#f0fdfa",
      }
    },
  },
  plugins: [],
}
