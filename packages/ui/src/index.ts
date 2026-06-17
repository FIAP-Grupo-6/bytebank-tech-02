/**
 * ─── @bytebank/ui — Design System compartilhado ────────────────────────────
 *
 * Componentes e tokens consumidos por TODOS os microfrontends (zonas).
 * Tokens: ./tailwind-preset (importado no tailwind.config de cada zona)
 * Componentes: exportados abaixo.
 */

export { Button, type ButtonProps } from './Button'
export { Input, type InputProps } from './Input'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
export { Alert, type AlertProps } from './Alert'
export {
  Select,
  SelectRoot,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  type SelectProps,
} from './Select'
export { DatePicker, Calendar, type DatePickerProps } from './DatePicker'
export { Logo } from './Logo'
export { cn } from './cn'
