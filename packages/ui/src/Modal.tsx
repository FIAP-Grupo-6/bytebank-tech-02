'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from './cn'

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void
  overlayClassName?: string
  closeOnOverlayClick?: boolean
}

export function Modal({
  onClose,
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  children,
  ...props
}: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { 
        onClose()
      }
    }

    document.addEventListener('keydown', handleKey)

    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (mounted === false) {
    return null
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className={cn('fixed inset-0 z-50 flex items-center justify-center', className)}
      {...props}
    >
      <div
        aria-hidden="true"
        className={cn('absolute inset-0 bg-black/60 backdrop-blur-sm', overlayClassName)}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      {children}
    </div>,
    document.body
  )
}
