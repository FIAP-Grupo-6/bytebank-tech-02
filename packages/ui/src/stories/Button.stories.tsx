import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Botão',
    variant: 'primary',
    size: 'md',
    isLoading: false,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Excluir' },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Saiba mais' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Loading: Story = {
  args: { isLoading: true, children: 'Salvando...' },
}

export const Disabled: Story = {
  args: { disabled: true },
}
