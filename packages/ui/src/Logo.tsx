import clsx from 'clsx'

interface LogoProps {
  /** Exibe o nome "ByteBank" ao lado do símbolo */
  withText?: boolean
  /** Cor do texto (símbolo é sempre verde sobre branco) */
  textClassName?: string
  size?: 'sm' | 'md'
}

/**
 * Marca do ByteBank — mesma identidade em todas as zonas.
 */
export function Logo({ withText = true, textClassName, size = 'md' }: LogoProps) {
  const box = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm'

  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          'bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0',
          box
        )}
        aria-hidden="true"
      >
        <span className="text-white font-bold">B</span>
      </div>
      {withText && (
        <span className={clsx('font-semibold text-lg', textClassName)}>
          ByteBank
        </span>
      )}
    </div>
  )
}
