const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: '#e3e6ea',
        input: '#e3e6ea',
        ring: '#2B4B80',
        background: '#ffffff',
        foreground: '#1e1e1e',
        primary: {
          DEFAULT: '#2B4B80',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f0f4fa',
          foreground: '#3a4a5a',
        },
        destructive: {
          DEFAULT: '#e63946',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f0f4fa',
          foreground: '#6d7c8c',
        },
        accent: {
          DEFAULT: '#f0f4fa',
          foreground: '#3a4a5a',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#1e1e1e',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1e1e1e',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
  plugins: [],
};
