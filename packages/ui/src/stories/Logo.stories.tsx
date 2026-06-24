import type { Meta, StoryObj } from '@storybook/react'
import { Logo } from '../Logo'

const meta = {
  title: 'Components/Logo',
  component: Logo,
  args: {
    withText: true,
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutText: Story = {
  args: { withText: false },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const SmallWithoutText: Story = {
  args: { size: 'sm', withText: false },
}

export const CustomTextColor: Story = {
  args: { textClassName: 'text-primary' },
}
