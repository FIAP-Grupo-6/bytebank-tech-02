import type { Config } from 'tailwindcss'
import preset from '@bytebank/ui/tailwind-preset'

/**
 * Os design tokens (cores, fontes) vêm do preset compartilhado em
 * packages/ui — fonte única de verdade para TODAS as zonas.
 *
 * O content inclui o source do @bytebank/ui: o Tailwind precisa escanear
 * os componentes do design system para gerar as classes que eles usam.
 */
const config: Config = {
  presets: [preset],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
}

export default config
