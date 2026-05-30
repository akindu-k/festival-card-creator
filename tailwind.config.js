/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9e7',
          100: '#faf0c2',
          200: '#f5e07a',
          300: '#f0cc3a',
          400: '#e8ba1a',
          500: '#D4AF37',
          600: '#B8962E',
          700: '#9a7a22',
          800: '#7c611a',
          900: '#5e4a12',
        },
        vesak: {
          saffron: '#FF9933',
          lotus:   '#E8A0BF',
          temple:  '#8B4513',
          night:   '#0d0a2e',
          indigo:  '#1a0a4e',
          cream:   '#FFF8E7',
          pearl:   '#FFF0F7',
        },
      },
      fontFamily: {
        display:    ['"Playfair Display"', 'Georgia', 'serif'],
        spiritual:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
        ui:         ['"Inter"', 'system-ui', 'sans-serif'],
        modern:     ['"Josefin Sans"', 'Helvetica', 'sans-serif'],
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'glow':      'glow 3s ease-in-out infinite alternate',
        'twinkle':   'twinkle 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%':   { boxShadow: '0 0 8px rgba(212,175,55,0.3)' },
          '100%': { boxShadow: '0 0 24px rgba(212,175,55,0.8), 0 0 48px rgba(212,175,55,0.4)' },
        },
        twinkle: {
          '0%':   { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gold-gradient':    'linear-gradient(135deg, #8B6914 0%, #D4AF37 50%, #F5D060 100%)',
        'night-gradient':   'radial-gradient(ellipse at top, #1a0a4e 0%, #0d0a2e 60%, #050215 100%)',
        'lotus-gradient':   'linear-gradient(135deg, #FFF0F7 0%, #F9F0FF 50%, #E8F4FF 100%)',
        'saffron-gradient': 'linear-gradient(180deg, #FF6B00 0%, #FF9933 30%, #FFD700 70%, #FFF8E7 100%)',
        'zen-gradient':     'linear-gradient(160deg, #FFFEF9 0%, #FFF8E7 100%)',
      },
    },
  },
  plugins: [],
}
