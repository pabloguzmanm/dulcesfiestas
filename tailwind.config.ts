import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Escanea todos los archivos en src/
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
      },
      colors: {
        primary: 'hsl(330 81% 58%)',
        secondary: 'hsl(280 65% 62%)',
        accent: 'hsl(45 100% 60%)',
        muted: 'hsl(45 100% 95%)',
        'muted-foreground': 'hsl(330 30% 50%)',
        destructive: 'hsl(0 84.2% 60.2%)',
      },
      boxShadow: {
        candy: 'var(--shadow-candy)',
      },
    },
  },
  plugins: [],
};

export default config;