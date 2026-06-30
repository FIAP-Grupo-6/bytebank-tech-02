'use client'

import { useState } from 'react'
import { X, Check, Target, TrendingDown } from 'lucide-react'
import { cn, Modal } from '@bytebank/ui'
import type { DashboardSettings } from './types'

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked ? 'bg-primary' : 'bg-muted'
      )}
    >
      <span
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  )
}

interface CustomizerModalProps {
  settings: DashboardSettings
  onSave: (s: DashboardSettings) => void
  onClose: () => void
  focusWidget?: 'savingsGoal' | 'spendingAlert' | null
}

const inputClass =
  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ' +
  'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

const labelClass = 'text-xs font-medium text-foreground/70 block mb-1'

export function CustomizerModal({ settings, onSave, onClose, focusWidget }: CustomizerModalProps) {
  const [draft, setDraft] = useState<DashboardSettings>(settings)

  const showSavingsGoal  = !focusWidget || focusWidget === 'savingsGoal'
  const showSpendingAlert = !focusWidget || focusWidget === 'spendingAlert'
  const showBoth = showSavingsGoal && showSpendingAlert

  return (
    <Modal onClose={onClose} aria-labelledby="customizer-title" className="items-end sm:items-center">
      <div className="relative bg-card border border-border rounded-t-2xl sm:rounded-xl w-full sm:max-w-md mx-0 sm:mx-4 z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 id="customizer-title" className="text-base font-semibold text-foreground">
              {focusWidget === 'savingsGoal'
                ? 'Meta de economia'
                : focusWidget === 'spendingAlert'
                ? 'Alerta de gastos'
                : 'Personalizar dashboard'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {focusWidget ? 'Configure este widget' : 'Ative e configure os widgets'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Meta de economia */}
          {showSavingsGoal && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Meta de economia</span>
                </div>
                <Toggle
                  checked={draft.savingsGoal.enabled}
                  onChange={(v) => setDraft((d) => ({ ...d, savingsGoal: { ...d.savingsGoal, enabled: v } }))}
                />
              </div>
              {draft.savingsGoal.enabled && (
                <div className="space-y-3 pl-6 border-l border-border">
                  <div>
                    <label htmlFor="goal-description" className={labelClass}>Descrição</label>
                    <input
                      id="goal-description"
                      type="text"
                      placeholder="Ex: Viagem, Reserva de emergência..."
                      value={draft.savingsGoal.description}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, savingsGoal: { ...d.savingsGoal, description: e.target.value } }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="goal-target" className={labelClass}>Valor alvo (R$)</label>
                    <input
                      id="goal-target"
                      type="number"
                      min="1"
                      step="100"
                      placeholder="10000"
                      value={draft.savingsGoal.targetAmount || ''}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          savingsGoal: { ...d.savingsGoal, targetAmount: Math.max(0, parseFloat(e.target.value) || 0) },
                        }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {showBoth && <hr className="border-border" />}

          {/* Alerta de gastos */}
          {showSpendingAlert && (
            <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-foreground">Alerta de gastos</span>
              </div>
              <Toggle
                checked={draft.spendingAlert.enabled}
                onChange={(v) => setDraft((d) => ({ ...d, spendingAlert: { ...d.spendingAlert, enabled: v } }))}
              />
            </div>
            {draft.spendingAlert.enabled && (
              <div className="space-y-3 pl-6 border-l border-border">
                <div>
                  <label htmlFor="alert-limit" className={labelClass}>Limite mensal (R$)</label>
                  <input
                    id="alert-limit"
                    type="number"
                    min="1"
                    step="100"
                    placeholder="3000"
                    value={draft.spendingAlert.monthlyLimit || ''}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        spendingAlert: { ...d.spendingAlert, monthlyLimit: Math.max(0, parseFloat(e.target.value) || 0) },
                      }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="alert-threshold" className={labelClass}>
                    Alertar a partir de {draft.spendingAlert.alertThreshold}% do limite
                  </label>
                  <input
                    id="alert-threshold"
                    type="range"
                    min="10"
                    max="95"
                    step="5"
                    value={draft.spendingAlert.alertThreshold}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        spendingAlert: { ...d.spendingAlert, alertThreshold: parseInt(e.target.value) },
                      }))
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                    <span>10%</span>
                    <span>95%</span>
                  </div>
                </div>
              </div>
            )}
            </section>
          )}
        </div>

        <div className="px-5 pb-5 pt-2 flex gap-3 sticky bottom-0 bg-card border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-colors font-semibold"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => { onSave(draft); onClose() }}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 flex items-center justify-center gap-2 transition-all"
          >
            <Check className="w-4 h-4" />
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  )
}
