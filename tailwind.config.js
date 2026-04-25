/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cosmo-green': 'var(--primary-color, #6b7280)',
      },
      spacing: {
        '15': '3.75rem',
      },
      height: {
        '7': '1.75rem',
      }
    },
  },
  plugins: [],
}