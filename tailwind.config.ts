import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#222222',
        olive: '#3B5D3B',
        warmgray: '#EAEAEA'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto)', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        subtle: '0 2px 12px rgba(34, 34, 34, 0.06)'
      }
    }
  },
  plugins: []
};

export default config;
