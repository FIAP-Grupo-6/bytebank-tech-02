import type { Meta, StoryObj } from '@storybook/react'
import { Select, SelectItem } from '../Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  args: {
    placeholder: 'Selecionar...',
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const options = (
  <>
    <SelectItem value="pix">Pix</SelectItem>
    <SelectItem value="ted">TED</SelectItem>
    <SelectItem value="doc">DOC</SelectItem>
    <SelectItem value="boleto">Boleto</SelectItem>
  </>
)

export const Default: Story = {
  render: (args) => (
    <div className="w-56">
      <Select {...args}>{options}</Select>
    </div>
  ),
}

export const WithLabel: Story = {
  args: { label: 'Tipo de transação' },
  render: (args) => (
    <div className="w-56">
      <Select {...args}>{options}</Select>
    </div>
  ),
}

export const WithError: Story = {
  args: { label: 'Tipo de transação', error: 'Selecione um tipo de transação.' },
  render: (args) => (
    <div className="w-56">
      <Select {...args}>{options}</Select>
    </div>
  ),
}

export const Disabled: Story = {
  args: { label: 'Tipo de transação', disabled: true },
  render: (args) => (
    <div className="w-56">
      <Select {...args}>{options}</Select>
    </div>
  ),
}
