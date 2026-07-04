/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2A4A',
          ink: '#081627',
          card: '#173B61',
          line: '#2A507A',
        },
        verde: {
          DEFAULT: '#5BAE2F',
          light: '#7DCB4F',
          dark: '#458023',
        },
        gas: {
          amber: '#F2B705',
          amberDark: '#C99304',
        },
        concrete: '#F1F2EE',
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'road-lines': 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(242,183,5,0.6) 40px, rgba(242,183,5,0.6) 72px)',
      },
      keyframes: {
        drive: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.7' },
        },
      },
      animation: {
        drive: 'drive 6s linear infinite',
        rise: 'rise 0.7s ease-out forwards',
        pulseDot: 'pulseDot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
