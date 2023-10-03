import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      "bg": "#D9D9D9",
      "bg-darker": "#C0C0C0",
      "accent-brown": "#A79E9E",
      "accent-brown-darker": "#878484",
      "accent-blue": "#015FCC",
    },
  },
  plugins: [],
}

export default config
