import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      'body': ['"Open Sans"'],
      'heading': ['"Poppins"', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'primary-ubc': '#002145',
        'search-primary': '#222830',
        'search-bar': "#363A43",
        'search-text': "#A1A4AB",
        'search-bold': "#2c2c2E",
        'search-highlight': "#00A7E1",
      }

    },
  },
  plugins: [],
};
export default config;
