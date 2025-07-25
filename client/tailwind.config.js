/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'granite-dark': '#2c2c2c',
        'granite-medium': '#4a4a4a',
        'granite-light': '#6a6a6a',
        'granite-lighter': '#8a8a8a',
        'turquoise-dark': '#1a7a7a',
        'turquoise-medium': '#20a0a0',
        'turquoise': '#20a0a0',
        'turquoise-light': '#40c0c0',
        'turquoise-lighter': '#60d0d0',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
      perspective: {
        '1000': '1000px',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
