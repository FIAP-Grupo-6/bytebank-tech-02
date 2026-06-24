/// <reference path="../src/global.d.ts" />
import type { Preview } from '@storybook/react'
import './preview.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'hsl(220 14% 8%)' },
        { name: 'card', value: 'hsl(220 14% 10%)' },
      ],
    },
  },
}

export default preview
