import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: '#3D4EAD',
          dark: '#30429E',
          light: '#A3B1F6',
          lightest: '#F5F7FF'
        },
        secondary: {
          light: '#B4C7F2',
          DEFAULT: '#7790ED', 
          dark: '#30429E'
        },
        'navy': {
          DEFAULT: '#0C2449',
          800: '#0C2449'
        },
        'accent-blue': '#7790ED',
        'light-blue': '#B4C7F2',
        gray: {
          DEFAULT: '#6B7280',
          100: '#F9F9F9',
          200: '#F5F7FF',
          300: '#E0E0E0',
          400: '#B9C8CF',
          500: '#6B7280',
          600: '#525149',
          700: '#4F4E4C',
          800: '#292621'
        },
        success: '#3CB371',
        error: '#FF0000',
        white: '#FFFFFF'
      },
      fontFamily: {
        sans: [
          'Avenir Next LT Pro',
          'Avenir LT Std',
          'Avenir',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '40px',
        '5xl': '51px',
        '6xl': '61px',
        '7xl': '70px',
        '8xl': '80px'
      },
      borderRadius: {
        'none': '0',
        'sm': '4px',
        DEFAULT: '8px',
        'lg': '12px',
        'full': '9999px'
      },
      boxShadow: {
        card: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        modal: '0px 10px 15px rgba(0, 0, 0, 0.1)',
        dropdown: '0px 2px 4px rgba(0, 0, 0, 0.05)'
      },
      spacing: {
        '2xs': '4px',
        'xs': '8px',
        'sm': '16px',
        'md': '24px',
        'lg': '32px',
        'xl': '48px',
        '2xl': '64px'
      },
      lineHeight: {
        'DEFAULT': '1.5',
        'heading': '1.2',
        'compact': '1.25'
      },
      minHeight: {
        '0': '0',
        'input': '48px',
        'textarea': '150px',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      borderColor: ['focus', 'active', 'disabled'],
      textColor: ['disabled'],
      ringColor: ['focus'],
      ringOpacity: ['focus'],
      ringWidth: ['focus']
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/line-clamp'),
  ],
} satisfies Config;
