/**
 * ─── DESIGN TOKENS DO BYTEBANK ──────────────────────────────────────────────
 *
 * Fonte única de verdade — mesma estrutura de tokens do Phase 1.
 * Cada microfrontend importa este preset no seu tailwind.config.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          hover: 'hsl(var(--surface-hover))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          background: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        /* Backward-compat — brand e surface-sidebar ainda funcionam */
        brand: {
          green: 'hsl(var(--primary))',
          'green-dark': 'hsl(148 80% 33%)',
          'green-light': 'hsl(var(--primary) / 0.15)',
        },
        'surface-sidebar': 'hsl(var(--sidebar-background))',
        'surface-hover': 'hsl(var(--surface-hover))',
        /* Override da escala de cinza para valores dark-friendly */
        gray: {
          50:  'hsl(220, 14%, 16%)',
          100: 'hsl(220, 14%, 18%)',
          200: 'hsl(220, 12%, 22%)',
          300: 'hsl(215, 15%, 42%)',
          400: 'hsl(215, 18%, 58%)',
          500: 'hsl(215, 20%, 65%)',
          600: 'hsl(215, 20%, 72%)',
          700: 'hsl(215, 20%, 80%)',
          800: 'hsl(215, 20%, 88%)',
          900: 'hsl(215, 20%, 95%)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
      },
    },
  },
}
