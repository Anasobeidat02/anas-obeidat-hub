import type { Config } from "tailwindcss";
   import animate from "tailwindcss-animate"; // Changed from require to import

   export default {
     darkMode: ["class"],
     content: [
       "./pages/**/*.{ts,tsx}",
       "./components/**/*.{ts,tsx}",
       "./app/**/*.{ts,tsx}",
       "./src/**/*.{ts,tsx}",
     ],
     prefix: "",
     theme: {
       container: {
         center: true,
         padding: '2rem',
         screens: {
           '2xl': '1400px'
         }
       },
       extend: {
         fontFamily: {
           sans: ['Inter', 'sans-serif'],
           display: ['Poppins', 'sans-serif'],
         },
         colors: {
           border: 'hsl(var(--border))',
           input: 'hsl(var(--input))',
           ring: 'hsl(var(--ring))',
           background: 'hsl(var(--background))',
           foreground: 'hsl(var(--foreground))',
           primary: {
             DEFAULT: '#1e3a8a',
             foreground: 'hsl(var(--primary-foreground))',
             50: '#eef2ff',
             100: '#e0e7ff',
             200: '#c7d2fe',
             300: '#a5b4fc',
             400: '#818cf8',
             500: '#6366f1',
             600: '#4f46e5',
             700: '#4338ca',
             800: '#1e3a8a',
             900: '#1e3a8a',
             950: '#0f172a',
           },
           secondary: {
             DEFAULT: 'hsl(var(--secondary))',
             foreground: 'hsl(var(--secondary-foreground))'
           },
           destructive: {
             DEFAULT: 'hsl(var(--destructive))',
             foreground: 'hsl(var(--destructive-foreground))'
           },
           muted: {
             DEFAULT: 'hsl(var(--muted))',
             foreground: 'hsl(var(--muted-foreground))'
           },
           accent: {
             DEFAULT: 'hsl(var(--accent))',
             foreground: 'hsl(var(--accent-foreground))'
           },
           popover: {
             DEFAULT: 'hsl(var(--popover))',
             foreground: 'hsl(var(--popover-foreground))'
           },
           card: {
             DEFAULT: 'hsl(var(--card))',
             foreground: 'hsl(var(--card-foreground))'
           },
           // Added colors for article headers
           cyan: {
             100: '#cffafe',
             500: '#06b6d4',
             900: '#164e63',
           },
           purple: {
             100: '#f3e8ff',
             500: '#8b5cf6',
             900: '#4c1d95',
           },
           silver: {
             100: '#f1f5f9',
             500: '#64748b',
             900: '#1e293b',
           },
           orange: {
             100: '#ffedd5',
             500: '#f97316',
             900: '#7c2d12',
           },
           blue: {
             100: '#dbeafe',
             500: '#3b82f6',
             900: '#1e3a8a',
           },
           red: {
             100: '#fee2e2',
             500: '#ef4444',
             900: '#991b1b',
           },
           green: {
             100: '#dcfce7',
             500: '#22c55e',
             900: '#14532d',
           },
           black: {
             100: '#e5e7eb',
             500: '#1f2937',
             900: '#111827',
           },
           yellow: {
             100: '#fef9c3',
             500: '#eab308',
             900: '#713f12',
           },
         },
         borderRadius: {
           lg: 'var(--radius)',
           md: 'calc(var(--radius) - 2px)',
           sm: 'calc(var(--radius) - 4px)'
         },
         keyframes: {
           'accordion-down': {
             from: { height: '0' },
             to: { height: 'var(--radix-accordion-content-height)' }
           },
           'accordion-up': {
             from: { height: 'var(--radix-accordion-content-height)' },
             to: { height: '0' }
           },
           fadeIn: {
             '0%': { opacity: '0' },
             '100%': { opacity: '1' }
           },
           slideUp: {
             '0%': { transform: 'translateY(100px)', opacity: '0' },
             '100%': { transform: 'translateY(0)', opacity: '1' }
           }
         },
         animation: {
           'accordion-down': 'accordion-down 0.2s ease-out',
           'accordion-up': 'accordion-up 0.2s ease-out',
           'fade-in': 'fadeIn 0.5s ease-in forwards',
           'slide-up': 'slideUp 0.5s ease-out forwards'
         }
       }
     },
     plugins: [animate], // Use the imported animate plugin
   } satisfies Config;