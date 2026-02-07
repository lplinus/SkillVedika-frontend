// import type { Config } from 'tailwindcss';

// const config: Config = {
//   content: [
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx}',
//     './lib/**/*.{js,ts,jsx,tsx}',
//     './pages/**/*.{js,ts,jsx,tsx}',
//   ],

//   theme: {
//     extend: {},
//   },

//   plugins: [],
// };

// export default config;



// import type { Config } from 'tailwindcss';

// const config: Config = {
//   darkMode: ['class'],
//   content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
//   theme: {
//     extend: {
//       colors: {
//         background: 'var(--background)',
//         foreground: 'var(--foreground)',
//         border: 'var(--border)',
//         ring: 'var(--ring)',
//         card: 'var(--card)',
//         'card-foreground': 'var(--card-foreground)',
//         primary: 'var(--primary)',
//         secondary: 'var(--secondary)',
//         muted: 'var(--muted)',
//         accent: 'var(--accent)',
//       },
//       fontFamily: {
//         sans: ['var(--font-sans)'],
//       },
//     },
//   },
//   plugins: [],
//   corePlugins: {
//     preflight: true,
//   },
// };

// export default config;


// import type { Config } from 'tailwindcss';

// const config: Config = {
//   darkMode: ['class'],
//   content: [
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx}',
//     './lib/**/*.{js,ts,jsx,tsx}',
//     './pages/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: 'var(--background)',
//         foreground: 'var(--foreground)',
//         border: 'var(--border)',
//         ring: 'var(--ring)',
//         card: 'var(--card)',
//         'card-foreground': 'var(--card-foreground)',
//         primary: 'var(--primary)',
//         secondary: 'var(--secondary)',
//         muted: 'var(--muted)',
//         accent: 'var(--accent)',
//       },
//       fontFamily: {
//         sans: ['var(--font-sans)'],
//       },
//     },
//   },
//   plugins: [],
//   corePlugins: {
//     preflight: true,
//   },
// };

// export default config;


/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};
