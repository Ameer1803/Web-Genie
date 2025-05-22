/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'pulse-line': {
          '0%, 100%': { transform: 'scaleX(0)', transformOrigin: 'center' },
          '50%': { transform: 'scaleX(1)', transformOrigin: 'center' },
        },
      },
      animation: {
        'pulse-line': 'pulse-line 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};