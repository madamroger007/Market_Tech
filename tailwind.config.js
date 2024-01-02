/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "green-cerah": "#9E9D24",
        primary: "#5542F6",
        highlight: "#EAE8FB",
        bgGray: "#fbfafd",
      },
    },
  },
  plugins: [],
};
