'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createUser } from '@bytebank/api-client'
import { Button, Input, Alert } from '@bytebank/ui'

const schema = z
  .object({
    username: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(4, 'Senha deve ter ao menos 4 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      await createUser({
        username: data.username,
        email: data.email,
        password: data.password,
      })

      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.'
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Nome completo"
        placeholder="João Silva"
        error={errors.username?.message}
        {...register('username')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Confirmar senha"
        type="password"
        placeholder="••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {serverError && <Alert tone="error">{serverError}</Alert>}

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </Button>
    </form>
  )
}
