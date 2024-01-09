import type { Config } from "tailwindcss";
import typographyPlugin from "@tailwindcss/typography";
// import formsPlugin from "@tailwindcss/forms";
// @ts-ignore
import sailsPlugin from "sailui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage:({theme}) => ({
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary":
          `linear-gradient(180deg, #EFDE40 9.02%, rgba(13, 13, 12, 0.83) 100%)`,
      }),
      colors: {
        primary: "black",
      },
    },
  },
  plugins: [
    typographyPlugin,
    /* formsPlugin({ strategy: "base" }), */
    sailsPlugin,
  ],
};
export default config;
