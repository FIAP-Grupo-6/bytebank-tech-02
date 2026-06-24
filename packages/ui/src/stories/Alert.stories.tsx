import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from '../Alert'

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: {
    children: 'Mensagem de alerta.',
    tone: 'error',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['error', 'success', 'info'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Error: Story = {
  args: {
    tone: 'error',
    children: 'E-mail ou senha incorretos. Tente novamente.',
  },
}

export const Success: Story = {
  args: {
    tone: 'success',
    children: 'Transação realizada com sucesso!',
  },
}

export const Info: Story = {
  args: {
    tone: 'info',
    children: 'Seu cadastro está em análise. Aguarde até 24h.',
  },
}
