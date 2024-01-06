/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        'login': '#002148',
        'nav': '#002148',
        'stu-primary': '#00479B',
        'stu-secondary': '#5889C2',
        'ins-primary': '#1B5901',
        'ins-secondary': '#2F9B05',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'), require('@tailwindcss/container-queries')],
}
