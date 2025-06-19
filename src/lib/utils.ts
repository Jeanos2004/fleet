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

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Rayon de la Terre en kilomètres
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export function calculateMissionCosts(distance: number, fuelConsumption: number = 35): {
  carburant: number
  peages: number
  primes: number
  total: number
} {
  const fuelPrice = 1.45 // Prix du gasoil en €/L
  const carburant = (distance * fuelConsumption / 100) * fuelPrice
  const peages = distance * 0.15 // Estimation péages
  const primes = Math.ceil(distance / 500) * 120 // 120€ par jour de mission
  
  return {
    carburant: Math.round(carburant * 100) / 100,
    peages: Math.round(peages * 100) / 100,
    primes,
    total: Math.round((carburant + peages + primes) * 100) / 100
  }
} 