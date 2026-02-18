/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fruit: {
          bg: '#003e31',      // 60% - Main Background
          primary: '#fee9d1', // 30% - Secondary/Text Surfaces
          accent: '#db6a28',  // 10% - Accent Color
          orange: '#db6a28',  // Consistent accent
          surface: '#004d3e', // Slightly lighter variation of bg
        }
      },
      animation: {
        gridMove: 'gridMove 20s linear infinite',
        glowPulse: 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        gridMove: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' }
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}