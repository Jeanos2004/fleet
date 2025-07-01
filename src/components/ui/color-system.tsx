"use client"

// Système de couleurs cohérent pour l'application
export const colorSystem = {
  // États de statut
  status: {
    success: {
      bg: 'bg-green-50 dark:bg-green-950',
      text: 'text-green-700 dark:text-green-300',
      border: 'border-green-200 dark:border-green-800',
      accent: 'bg-green-500',
      light: 'bg-green-100 dark:bg-green-900/30'
    },
    warning: {
      bg: 'bg-orange-50 dark:bg-orange-950',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200 dark:border-orange-800',
      accent: 'bg-orange-500',
      light: 'bg-orange-100 dark:bg-orange-900/30'
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      accent: 'bg-red-500',
      light: 'bg-red-100 dark:bg-red-900/30'
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      accent: 'bg-blue-500',
      light: 'bg-blue-100 dark:bg-blue-900/30'
    },
    neutral: {
      bg: 'bg-gray-50 dark:bg-gray-950',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-800',
      accent: 'bg-gray-500',
      light: 'bg-gray-100 dark:bg-gray-900/30'
    }
  },

  // Couleurs métier spécifiques
  business: {
    fuel: {
      excellent: 'text-green-600 dark:text-green-400',
      good: 'text-blue-600 dark:text-blue-400',
      warning: 'text-orange-600 dark:text-orange-400',
      critical: 'text-red-600 dark:text-red-400'
    },
    performance: {
      high: 'text-green-600 dark:text-green-400',
      medium: 'text-orange-600 dark:text-orange-400',
      low: 'text-red-600 dark:text-red-400'
    },
    priority: {
      urgent: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950',
      high: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950',
      medium: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950',
      low: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950'
    }
  },

  // Indicateurs de progression
  progress: {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    warning: 'bg-orange-500',
    danger: 'bg-red-500'
  }
}

// Helpers pour obtenir les classes CSS
export const getStatusClasses = (type: keyof typeof colorSystem.status) => {
  return colorSystem.status[type]
}

export const getFuelLevelColor = (level: number) => {
  if (level >= 75) return colorSystem.business.fuel.excellent
  if (level >= 50) return colorSystem.business.fuel.good
  if (level >= 25) return colorSystem.business.fuel.warning
  return colorSystem.business.fuel.critical
}

export const getPerformanceColor = (value: number, target: number) => {
  const ratio = value / target
  if (ratio >= 1) return colorSystem.business.performance.high
  if (ratio >= 0.8) return colorSystem.business.performance.medium
  return colorSystem.business.performance.low
}

export const getProgressBarColor = (percentage: number) => {
  if (percentage >= 90) return colorSystem.progress.excellent
  if (percentage >= 70) return colorSystem.progress.good
  if (percentage >= 40) return colorSystem.progress.warning
  return colorSystem.progress.danger
} 