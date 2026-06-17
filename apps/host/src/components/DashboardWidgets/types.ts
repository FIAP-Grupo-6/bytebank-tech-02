export interface SavingsGoalConfig {
  enabled: boolean
  description: string
  targetAmount: number
}

export interface SpendingAlertConfig {
  enabled: boolean
  monthlyLimit: number
  alertThreshold: number
}

export interface DashboardSettings {
  savingsGoal: SavingsGoalConfig
  spendingAlert: SpendingAlertConfig
}
