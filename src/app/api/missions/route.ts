import { NextResponse } from 'next/server'
import { mockMissions, mockCamions, mockChauffeurs } from '@/lib/db/mock-data'

export async function GET() {
  try {
    // Simuler une latence réseau
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Enrichir les missions avec les données des camions et chauffeurs
    const enrichedMissions = mockMissions.map(mission => ({
      ...mission,
      camion: mockCamions.find(c => c.id === mission.camionId),
      chauffeur: mockChauffeurs.find(c => c.id === mission.chauffeurId)
    }))

    return NextResponse.json({
      success: true,
      data: enrichedMissions,
      total: enrichedMissions.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des missions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.camionId || !body.chauffeurId || !body.sites || body.sites.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes pour créer la mission' },
        { status: 400 }
      )
    }

    // Simuler la création d'une nouvelle mission
    const newMission = {
      id: String(mockMissions.length + 1),
      type: body.sites.length > 1 ? 'MULTIPLE' : 'UNIQUE',
      statut: 'PLANIFIEE',
      camionId: body.camionId,
      chauffeurId: body.chauffeurId,
      sites: body.sites.map((site: any, index: number) => ({
        id: String(Date.now() + index),
        missionId: String(mockMissions.length + 1),
        siteId: site.siteId,
        ordre: index + 1,
        quantiteLivree: site.quantiteLivree
      })),
      dateDebut: new Date(body.dateDebut),
      distanceEstimee: body.distanceEstimee || 0,
      fraisEstimes: {
        carburant: body.distanceEstimee * 0.15,
        peages: body.distanceEstimee * 0.05,
        primes: 50,
        total: body.distanceEstimee * 0.20 + 50
      },
      validee: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Ajouter à la liste mockée (en réalité, on sauvegarderait en BDD)
    mockMissions.push(newMission as any)

    return NextResponse.json({
      success: true,
      data: newMission,
      message: 'Mission créée avec succès'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la mission' },
      { status: 500 }
    )
  }
} 