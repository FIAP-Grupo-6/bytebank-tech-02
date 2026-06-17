import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

/**
 * Hooks tipados — substitui useDispatch e useSelector genéricos.
 * Uso: const dispatch = useAppDispatch()
 *      const items = useAppSelector(s => s.transactions.items)
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector)
