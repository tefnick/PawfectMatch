import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'dark-gradient': "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      }
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          // ...
          colors: {
            primary: {
              DEFAULT: "#17C964",
              foreground: "#000000",
            },
            focus: "#BEF264",
            secondary: {
              DEFAULT: "#F5A524",
              foreground: "#000000",
            },
          },
        },
        dark: {
          // ...
          colors: {},
        },
        // ... custom themes
      },
    }),
  ],
};
export default config;
