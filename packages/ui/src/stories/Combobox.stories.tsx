import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Combobox } from '../Combobox'

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
  args: {
    placeholder: 'Selecionar...',
    searchPlaceholder: 'Buscar...',
    emptyText: 'Nenhum resultado.',
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

const categoryOptions = [
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'moradia', label: 'Moradia' },
  { value: 'saude', label: 'Saúde' },
  { value: 'lazer', label: 'Lazer' },
  { value: 'educacao', label: 'Educação' },
  { value: 'vestuario', label: 'Vestuário' },
  { value: 'outros', label: 'Outros' },
]

function Controlled(props: React.ComponentProps<typeof Combobox>) {
  const [value, setValue] = useState(props.value ?? '')
  return (
    <div className="w-56">
      <Combobox {...props} value={value} onValueChange={setValue} />
    </div>
  )
}

export const Default: Story = {
  render: (args) => <Controlled {...args} options={categoryOptions} />,
}

export const ComLabel: Story = {
  name: 'Com label',
  args: { label: 'Categoria' },
  render: (args) => <Controlled {...args} options={categoryOptions} />,
}

export const ComValorSelecionado: Story = {
  name: 'Com valor selecionado',
  args: { label: 'Categoria', value: 'alimentacao' },
  render: (args) => <Controlled {...args} options={categoryOptions} />,
}

export const Clearable: Story = {
  name: 'Com limpeza (clearable)',
  args: { label: 'Categoria', clearable: true, value: 'transporte' },
  render: (args) => <Controlled {...args} options={categoryOptions} />,
}

export const ComErro: Story = {
  name: 'Com erro',
  args: { label: 'Categoria', error: 'Selecione uma categoria.' },
  render: (args) => <Controlled {...args} options={categoryOptions} />,
}

export const Desabilitado: Story = {
  name: 'Desabilitado',
  args: { label: 'Categoria', disabled: true },
  render: (args) => <Controlled {...args} options={categoryOptions} />,
}

export const MuitasOpcoes: Story = {
  name: 'Muitas opções (busca útil)',
  args: { label: 'Subcategoria', placeholder: 'Selecione uma subcategoria...' },
  render: (args) => (
    <Controlled
      {...args}
      options={[
        { value: 'restaurante', label: 'Restaurante' },
        { value: 'supermercado', label: 'Supermercado' },
        { value: 'delivery', label: 'Delivery' },
        { value: 'padaria', label: 'Padaria' },
        { value: 'lanche', label: 'Lanche' },
        { value: 'cafeteria', label: 'Cafeteria' },
        { value: 'feira', label: 'Feira' },
        { value: 'combustivel', label: 'Combustível' },
        { value: 'uber', label: 'Uber/99' },
        { value: 'transporte-publico', label: 'Transporte público' },
        { value: 'estacionamento', label: 'Estacionamento' },
        { value: 'pedagio', label: 'Pedágio' },
      ]}
    />
  ),
}
