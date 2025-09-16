import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        aws: {
          blue: '#232F3E',
          orange: '#FF9900',
          teal: '#00A3A3',
          gray: '#F2F3F3'
        }
      }
    }
  },
  plugins: []
};

export default config;
