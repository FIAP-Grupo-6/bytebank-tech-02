'use client'

import { useState, useEffect } from 'react'
import type { DashboardSettings } from './types'

const STORAGE_KEY = 'bytebank_dashboard_settings'

const defaults: DashboardSettings = {
  savingsGoal: { enabled: false, description: 'Minha meta', targetAmount: 10000 },
  spendingAlert: { enabled: false, monthlyLimit: 3000, alertThreshold: 80 },
}

function loadSettings(): DashboardSettings {
  if (typeof window === 'undefined') return defaults
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<DashboardSettings>
    return {
      savingsGoal: { ...defaults.savingsGoal, ...parsed.savingsGoal },
      spendingAlert: { ...defaults.spendingAlert, ...parsed.spendingAlert },
    }
  } catch {
    return defaults
  }
}

export function useDashboardSettings() {
  const [settings, setSettings] = useState<DashboardSettings>(defaults)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setSettings(loadSettings())
    setHydrated(true)
  }, [])

  const save = (updated: DashboardSettings) => {
    setSettings(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { settings, save, hydrated }
}
