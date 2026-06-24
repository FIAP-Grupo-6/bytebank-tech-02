import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Card'
import { Button } from '../Button'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">
        <p>Conteúdo simples dentro de um card.</p>
      </CardContent>
    </Card>
  ),
}

export const WithHeader: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Título do Card</CardTitle>
        <CardDescription>Descrição complementar com informações adicionais.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Corpo do card com o conteúdo principal.</p>
      </CardContent>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Confirmar ação</CardTitle>
        <CardDescription>Essa ação não pode ser desfeita.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja continuar?
        </p>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button variant="ghost" size="sm">Cancelar</Button>
        <Button variant="destructive" size="sm">Confirmar</Button>
      </CardFooter>
    </Card>
  ),
}

export const AccountBalance: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <CardDescription>Saldo disponível</CardDescription>
        <CardTitle className="text-3xl font-bold text-primary">R$ 4.250,00</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">Atualizado agora</p>
      </CardContent>
    </Card>
  ),
}
