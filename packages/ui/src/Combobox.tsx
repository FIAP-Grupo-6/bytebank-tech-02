'use client'

import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { cn } from './cn'

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  label?: string
  error?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  clearable?: boolean
  id?: string
  options: ComboboxOption[]
  className?: string
}

export function Combobox({
  label,
  error,
  placeholder = 'Selecionar...',
  searchPlaceholder = 'Buscar...',
  emptyText = 'Nenhum resultado.',
  value,
  onValueChange,
  disabled,
  clearable = false,
  id: idProp,
  options,
  className,
}: ComboboxProps) {
  const autoId = React.useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const searchRef = React.useRef<HTMLInputElement>(null)

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const selectedLabel = options.find((opt) => opt.value === value)?.label

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setSearch('')
  }

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

      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button
            id={id}
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'cursor-default font-[inherit]',
              !selectedLabel && 'text-muted-foreground',
              error && 'border-destructive'
            )}
          >
            <span className="line-clamp-1 text-left flex-1 min-w-0">
              {selectedLabel ?? placeholder}
            </span>
            <span className="flex items-center shrink-0 ml-1 gap-0.5">
              {clearable && value && (
                <span
                  role="button"
                  aria-label="Limpar seleção"
                  onPointerDown={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onValueChange?.('')
                  }}
                  className="flex items-center justify-center w-4 h-4 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </span>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            onOpenAutoFocus={(e) => {
              e.preventDefault()
              searchRef.current?.focus()
            }}
            className={cn(
              'z-50 w-[var(--radix-popover-trigger-width)] rounded-md border border-border bg-card shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
              'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            )}
          >
            <div className="flex items-center border-b border-border px-3">
              <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-2" aria-hidden="true" />
              <input
                ref={searchRef}
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar opção"
                className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div role="listbox" className="max-h-60 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>
              ) : (
                filtered.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={value === opt.value}
                    onClick={() => {
                      onValueChange?.(opt.value)
                      setSearch('')
                      setOpen(false)
                    }}
                    className={cn(
                      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-foreground',
                      'hover:bg-accent hover:text-accent-foreground outline-none text-left',
                      value === opt.value && 'bg-accent/50'
                    )}
                  >
                    {value === opt.value && (
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive mt-1.5">
          {error}
        </p>
      )}
    </div>
  )
}
