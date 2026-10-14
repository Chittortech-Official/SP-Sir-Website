/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        police: {
          900: '#0B1728', // Deepest Navy
          800: '#112240', // Deep Police Blue
          700: '#1D3557', // Classic Rajasthan Police Blue
          600: '#2A4A7F',
          100: '#E8EEF5',
          50: '#F4F7FB',
        },
        khaki: {
          600: '#8C6D3F',
          500: '#B08958',
          100: '#F5EFE6',
        },
        saffron: {
          500: '#E65100',
          600: '#D84315',
          50: '#FFF3E0',
        },
        govgreen: {
          600: '#137333',
          500: '#1E8E3E',
          50: '#E6F4EA',
        }
      },
      fontFamily: {
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 23, 40, 0.08), 0 2px 6px -1px rgba(11, 23, 40, 0.04)',
        'status': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
