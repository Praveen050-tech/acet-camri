/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00714C',     // ACET Official Institutional Emerald Green
        secondary: '#FFDA0F',   // ACET Vibrant Golden Yellow Accent
        accent: '#F4E757',      // ACET Bright CTA Yellow
        lime: '#C9D845',        // ACET Fresh Lime Green
        apple: '#87C03D',       // ACET Leaf Green
        surface: '#F5F5F2',     // ACET Warm Off-White / Grey
        darkGreen: '#005539',   // ACET Deep Forest Carousel
        footerGreen: '#006342', // ACET Dark Footer Green
        topbarGreen: '#007C3D', // ACET Header Top Bar Green
        acet: {
          50: '#eef9f3',
          100: '#d6f2e3',
          200: '#aee6cb',
          300: '#77d4ab',
          400: '#3fbc87',
          500: '#1ca26e',
          600: '#00714C', // Main Brand Green
          700: '#007C3D', // Top Bar Green
          800: '#006342', // Footer Green
          900: '#005539', // Deep Forest Green
          950: '#00291c', // Night Dark Green
        },
        yellow: {
          accent: '#F4E757',
          gold: '#FFDA0F',
        }
      },
      fontFamily: {
        sans: ['Public Sans', 'system-ui', 'sans-serif'],
        display: ['Readex Pro', 'Public Sans', 'sans-serif'],
        heading: ['Readex Pro', 'Public Sans', 'sans-serif'],
        body: ['Public Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
};
