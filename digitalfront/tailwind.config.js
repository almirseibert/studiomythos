/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0A0E1A',
          900: '#0B1020',
          800: '#111827',
        },
        voltage: {
          DEFAULT: '#22D3EE',
          light: '#67E8F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        voltage: '0 10px 30px -10px rgba(79, 70, 229, 0.5)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 55%, #6D28D9 100%)',
      },
    },
  },
  plugins: [],
}
