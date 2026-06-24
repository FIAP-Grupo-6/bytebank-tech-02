import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '../Input'

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'Digite aqui...',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  args: { label: 'E-mail', placeholder: 'seu@email.com', type: 'email' },
}

export const WithError: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    placeholder: '••••••••',
    error: 'A senha deve ter no mínimo 8 caracteres.',
  },
}

export const Disabled: Story = {
  args: { label: 'CPF', value: '000.000.000-00', disabled: true },
}

export const Password: Story = {
  args: { label: 'Senha', type: 'password', placeholder: '••••••••' },
}
