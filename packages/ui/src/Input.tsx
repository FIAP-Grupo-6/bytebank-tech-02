'use client'

import * as React from 'react'
import { cn } from './cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, className, id: idProp, type, ...props }, ref) {
    const autoId = React.useId()
    const id = idProp ?? autoId
    const errorId = `${id}-error`

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-foreground/80 block mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'md:text-sm file:border-0 file:bg-transparent',
            error && 'border-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="text-xs text-destructive mt-1.5">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
