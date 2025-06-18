import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'planifiee':
    case 'planifiée':
      return 'bg-blue-100 text-blue-800'
    case 'en_cours':
    case 'en cours':
      return 'bg-yellow-100 text-yellow-800'
    case 'terminee':
    case 'terminée':
      return 'bg-green-100 text-green-800'
    case 'annulee':
    case 'annulée':
      return 'bg-red-100 text-red-800'
    case 'disponible':
      return 'bg-green-100 text-green-800'
    case 'en_mission':
    case 'en mission':
      return 'bg-blue-100 text-blue-800'
    case 'en_maintenance':
    case 'en maintenance':
      return 'bg-orange-100 text-orange-800'
    case 'hors_service':
    case 'hors service':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
} 