'use client'

import * as React from 'react'
import { SelectRoot, SelectTrigger, SelectValue, SelectContent } from './primitives'

export interface SelectProps {
  label?: string
  error?: string
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  id?: string
  children: React.ReactNode
  className?: string
}

export function Select({
  label,
  error,
  placeholder,
  value,
  onValueChange,
  disabled,
  id: idProp,
  children,
  className,
}: SelectProps) {
  const autoId = React.useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-foreground/80 block mb-1.5"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(id)?.click()
          }}
        >
          {label}
        </label>
      )}
      <SelectRoot value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        >
          <SelectValue placeholder={placeholder ?? 'Selecionar...'} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </SelectRoot>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive mt-1.5">
          {error}
        </p>
      )}
    </div>
  )
}
