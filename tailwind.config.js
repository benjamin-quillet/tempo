/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Optionnel: si un jour tu remets src/
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tempo: {
          ink: "#091114",
          navy: "#112C36",
          mint: "#83C7B1",
          teal: "#7CC3B6",
          sky: "#6BACB2",
          blue: "#3E81BE",
          azure: "#539ABF",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,195,182,.22), 0 20px 80px rgba(62,129,190,.22)",
        soft: "0 10px 40px rgba(0,0,0,.25)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 10s ease infinite",
      },
    },
  },
  plugins: [],
};
