import { NextResponse } from 'next/server'
import { mockTelemetryData } from '@/lib/db/mock-data'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const camionId = searchParams.get('camionId')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Simuler une latence réseau
    await new Promise(resolve => setTimeout(resolve, 50))
    
    let data = mockTelemetryData
    
    // Filtrer par camion si spécifié
    if (camionId) {
      data = data.filter(d => d.camionId === camionId)
    }
    
    // Simuler des données temps réel en ajoutant de la variation
    const realtimeData = data.map(item => ({
      ...item,
      timestamp: new Date(),
      vitesse: Math.max(0, item.vitesse + (Math.random() - 0.5) * 10),
      odometre: item.odometre + Math.floor(Math.random() * 5),
      consommation: Math.max(0, item.consommation + (Math.random() - 0.5) * 2),
      vibration: Math.max(0, item.vibration + (Math.random() - 0.5) * 0.5),
      temperature: item.temperature + (Math.random() - 0.5) * 5
    })).slice(0, limit)

    return NextResponse.json({
      success: true,
      data: realtimeData,
      total: realtimeData.length,
      timestamp: new Date()
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des données télémétrie' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.camionId || !body.latitude || !body.longitude) {
      return NextResponse.json(
        { success: false, error: 'Données télémétrie incomplètes' },
        { status: 400 }
      )
    }

    // Simuler l'enregistrement de nouvelles données télémétrie
    const newTelemetryData = {
      id: String(Date.now()),
      camionId: body.camionId,
      timestamp: new Date(),
      latitude: body.latitude,
      longitude: body.longitude,
      vitesse: body.vitesse || 0,
      odometre: body.odometre || 0,
      consommation: body.consommation || 0,
      vibration: body.vibration || 0,
      temperature: body.temperature || 20
    }

    // Ajouter aux données mockées
    mockTelemetryData.push(newTelemetryData)

    return NextResponse.json({
      success: true,
      data: newTelemetryData,
      message: 'Données télémétrie enregistrées'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de l\'enregistrement des données télémétrie' },
      { status: 500 }
    )
  }
} 