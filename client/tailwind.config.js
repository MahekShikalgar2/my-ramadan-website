module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#b9e1b9',
          300: '#8fc98f',
          400: '#65b065',
          500: '#4a8b4a',
          600: '#3a6f3a',
          700: '#2e562e',
          800: '#244424',
          900: '#1d361d',
        },
        gold: {
          50: '#fbf7e9',
          100: '#f7efd3',
          200: '#efdfa7',
          300: '#e7cf7b',
          400: '#dfbf4f',
          500: '#d7af23',
          600: '#b38f1c',
          700: '#8f6f15',
          800: '#6b4f0e',
          900: '#473507',
        },
        islamic: {
          green: '#2E7D32',
          gold: '#FFD700',
          dark: '#1B5E20',
          light: '#A5D6A7',
        }
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}