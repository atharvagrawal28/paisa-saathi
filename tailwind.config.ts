import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50: '#eefbf6', 100: '#d4f5e7', 500: '#0f9d6e', 600: '#0b7d57', 700: '#085f43' },
        ink: { 900: '#0f1b2d', 700: '#33414f', 500: '#647082' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'Noto Sans', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        deva: ['Noto Sans Devanagari', 'Inter', 'system-ui', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
