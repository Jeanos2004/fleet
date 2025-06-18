import { NextRequest, NextResponse } from 'next/server'
import { mockCamions } from '@/lib/db/mock-data'

interface TelemetryReading {
  camionId: string
  timestamp: Date
  latitude: number
  longitude: number
  vitesse: number
  odometre: number
  consommationInstantanee: number
  consommationMoyenne: number
  temperatureMoteur: number
  pressionPneus: number[]
  alertes: string[]
  statut: 'EN_MARCHE' | 'ARRET' | 'MAINTENANCE' | 'ALERTE'
}

// Simulation de données de base pour chaque camion
const baseLocations = {
  '1': { lat: 48.8566, lon: 2.3522, odo: 125430 }, // Paris
  '2': { lat: 45.7640, lon: 4.8357, odo: 98750 },  // Lyon  
  '3': { lat: 43.2965, lon: 5.3698, odo: 156890 }  // Marseille
}

// Génération de données télémétrie simulées
function generateTelemetryData(camionId: string): TelemetryReading {
  const base = baseLocations[camionId as keyof typeof baseLocations] || baseLocations['1']
  const now = new Date()
  
  // Variation de position (simulation mouvement)
  const timeVariation = (now.getTime() / 100000) % 1
  const posVariation = Math.sin(timeVariation * Math.PI * 2) * 0.01
  
  // Génération de données réalistes
  const vitesse = Math.floor(Math.random() * 80) + 20 // 20-100 km/h
  const tempMoteur = Math.random() * 25 + 75 // 75-100°C
  const consommation = Math.random() * 15 + 25 // 25-40 L/100km
  
  // Génération d'alertes aléatoires
  const alertes: string[] = []
  if (Math.random() > 0.9) alertes.push('Conduite agressive détectée')
  if (tempMoteur > 95) alertes.push('Température moteur élevée')
  if (vitesse > 90) alertes.push('Excès de vitesse')
  
  // Pression des pneus (6 pneus par camion-citerne)
  const pressionPneus = Array.from({ length: 6 }, () => {
    const basePressure = 8.0
    const variation = (Math.random() - 0.5) * 0.4
    return Math.max(7.0, Math.min(8.5, basePressure + variation))
  })
  
  // Détection de pression faible
  if (pressionPneus.some(p => p < 7.5)) {
    alertes.push('Pression pneu faible détectée')
  }

  return {
    camionId,
    timestamp: now,
    latitude: base.lat + posVariation,
    longitude: base.lon + posVariation,
    vitesse,
    odometre: base.odo + Math.floor(timeVariation * 100),
    consommationInstantanee: consommation,
    consommationMoyenne: consommation * 0.9 + Math.random() * 5,
    temperatureMoteur: tempMoteur,
    pressionPneus,
    alertes,
    statut: alertes.length > 0 ? 'ALERTE' : 'EN_MARCHE'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const camionId = searchParams.get('camionId')
    
    if (camionId) {
      // Données pour un camion spécifique
      const camion = mockCamions.find(c => c.id === camionId)
      if (!camion) {
        return NextResponse.json(
          { error: 'Camion non trouvé' },
          { status: 404 }
        )
      }
      
      const telemetryData = generateTelemetryData(camionId)
      return NextResponse.json(telemetryData)
    } else {
      // Données pour tous les camions disponibles
      const allTelemetryData: Record<string, TelemetryReading> = {}
      
      mockCamions
        .filter(camion => camion.disponible)
        .forEach(camion => {
          allTelemetryData[camion.id] = generateTelemetryData(camion.id)
        })
      
      return NextResponse.json({
        timestamp: new Date(),
        data: allTelemetryData,
        summary: {
          totalCamions: Object.keys(allTelemetryData).length,
          camionsEnAlerte: Object.values(allTelemetryData).filter(d => d.statut === 'ALERTE').length,
          consommationMoyenne: Object.values(allTelemetryData).reduce((sum, d) => sum + d.consommationMoyenne, 0) / Object.keys(allTelemetryData).length
        }
      })
    }
  } catch (error) {
    console.error('Erreur API télémétrie:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { camionId, ...telemetryData } = body
    
    // Validation des données reçues
    if (!camionId) {
      return NextResponse.json(
        { error: 'ID camion requis' },
        { status: 400 }
      )
    }
    
    const camion = mockCamions.find(c => c.id === camionId)
    if (!camion) {
      return NextResponse.json(
        { error: 'Camion non trouvé' },
        { status: 404 }
      )
    }
    
    // Dans un vrai système, on sauvegarderait en base de données
    // Ici on simule juste la réception des données
    console.log(`Données télémétrie reçues pour ${camionId}:`, telemetryData)
    
    // Mise à jour de l'odomètre du camion si fourni
    if (telemetryData.odometre && telemetryData.odometre > camion.odometre) {
      camion.odometre = telemetryData.odometre
    }
    
    return NextResponse.json({
      success: true,
      message: 'Données télémétrie enregistrées',
      camionId,
      timestamp: new Date()
    })
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement télémétrie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    )
  }
}

// WebSocket simulation pour les données temps réel
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'subscribe') {
      // Simulation d'un abonnement WebSocket
      // Dans un vrai système, on établirait une connexion WebSocket
      return NextResponse.json({
        success: true,
        message: 'Abonnement aux données temps réel activé',
        endpoint: '/api/telemetry/real-time',
        updateInterval: 5000 // 5 secondes
      })
    }
    
    return NextResponse.json(
      { error: 'Action non supportée' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erreur WebSocket simulation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    )
  }
} 