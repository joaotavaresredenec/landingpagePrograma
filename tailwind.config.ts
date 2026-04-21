import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './config/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        redenec: {
          verde: '#1cff9e',
          azul: '#0086ff',
          petroleo: '#1b415e',
          escuro: '#243837',
          coral: '#ff8b80',
          cinza: '#e5e4e9',
        },
      },
      fontFamily: {
        sans: ['var(--font-figtree)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
      },
      fontSize: {
        'h1-mobile': ['36px', { lineHeight: '1.15' }],
        'h1-desktop': ['64px', { lineHeight: '1.1' }],
        'h2-mobile': ['28px', { lineHeight: '1.2' }],
        'h2-desktop': ['40px', { lineHeight: '1.15' }],
        'h3': ['20px', { lineHeight: '1.2' }],
        'body': ['16px', { lineHeight: '1.6' }],
        'micro': ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'site': '1280px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
