import { type HTMLAttributes } from 'react'
import clsx from 'clsx'

type Tone = 'error' | 'success' | 'info'

const toneClasses: Record<Tone, string> = {
  error:   'bg-red-500/10 border-red-500/20 text-red-400',
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
  info:    'bg-blue-500/10 border-blue-500/20 text-blue-400',
}

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: Tone
}

export function Alert({ tone = 'error', className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={clsx(
        'border rounded-lg p-3 text-sm',
        toneClasses[tone],
        className
      )}
      {...props}
    />
  )
}
