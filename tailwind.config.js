/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 Dark Theme Palette
        surface: '#131313',
        'surface-low': '#1b1b1c',
        'surface-lowest': '#0e0e0e',
        'surface-high': '#2a2a2a',
        'surface-highest': '#353535',
        primary: '#2563eb',
        'primary-light': '#b4c5ff',
        secondary: '#62df7d',
        tertiary: '#ffb596',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#c3c6d7',
        outline: '#8d90a0',
        'outline-variant': '#434655',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        pulse: 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
