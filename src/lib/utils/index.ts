import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitaires pour les calculs de distance
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Utilitaires pour le formatage
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function formatDistance(distance: number): string {
  return `${distance.toFixed(1)} km`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR').format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Utilitaires pour les calculs de frais
export function calculateMissionCosts(distance: number) {
  const COUT_CARBURANT_PAR_KM = 0.15; // €/km
  const COUT_PEAGE_PAR_KM = 0.05; // €/km
  const PRIME_BASE = 50; // € par mission

  return {
    carburant: distance * COUT_CARBURANT_PAR_KM,
    peages: distance * COUT_PEAGE_PAR_KM,
    primes: PRIME_BASE,
    total: distance * (COUT_CARBURANT_PAR_KM + COUT_PEAGE_PAR_KM) + PRIME_BASE
  };
}

// Utilitaire pour calculer l'écart en pourcentage
export function calculatePercentageDifference(estimated: number, actual: number): number {
  if (estimated === 0) return 0;
  return ((actual - estimated) / estimated) * 100;
}

// Utilitaire pour générer des IDs uniques
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Utilitaires pour les couleurs des statuts
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'DISPONIBLE': 'text-green-600 bg-green-50',
    'EN_MISSION': 'text-blue-600 bg-blue-50',
    'EN_MAINTENANCE': 'text-orange-600 bg-orange-50',
    'HORS_SERVICE': 'text-red-600 bg-red-50',
    'PLANIFIEE': 'text-blue-600 bg-blue-50',
    'EN_COURS': 'text-yellow-600 bg-yellow-50',
    'TERMINEE': 'text-green-600 bg-green-50',
    'ANNULEE': 'text-red-600 bg-red-50',
    'EMISE': 'text-blue-600 bg-blue-50',
    'PAYEE': 'text-green-600 bg-green-50',
    'EN_RETARD': 'text-red-600 bg-red-50',
  };
  return statusColors[status] || 'text-gray-600 bg-gray-50';
}

// Utilitaire pour valider les données
export function validateOdometerReading(start: number, end: number): boolean {
  return end > start;
}

export function isMaintenanceDue(lastMaintenance: Date, intervalDays: number = 90): boolean {
  const now = new Date();
  const daysSinceLastMaintenance = (now.getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceLastMaintenance >= intervalDays;
} 