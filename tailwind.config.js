/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        barcode: ['barcode'],
        alexandria: ['alexandria'],
        orbitron: ['orbitron'],
      },
      colors: {
        purplea: '#815fc1',
        purpleb: '#674b9c',
      },
    },
  },
  plugins: [],
};
