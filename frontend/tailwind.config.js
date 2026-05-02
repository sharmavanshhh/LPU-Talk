/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E8630A',
        'primary-light': '#FFF3E0',
        'bg-main': '#FAF6EF',
        'bg-sidebar': '#F5ECD7',
        'text-dark': '#3D2B1F',
        'text-muted': '#8B7355',
        border: '#D4A574',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
