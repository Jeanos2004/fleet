import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/db/mock-data'
import { StatutMission } from '@/types'

// GET - Récupérer un véhicule par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const vehicle = mockData.camions.find(v => v.id === id)
    
    if (!vehicle) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Véhicule non trouvé' 
        },
        { status: 404 }
      )
    }
    
    // Enrichir avec des données supplémentaires
    const enrichedVehicle = {
      ...vehicle,
      capacite: vehicle.capaciteCiterne, // Alias pour compatibilité
      kilometrage: vehicle.odometre, // Alias pour compatibilité
      maintenanceHistory: [], // Simulation - pas de données de maintenance dans mock-data
      driver: vehicle.chauffeurId ? mockData.chauffeurs.find(c => c.id === vehicle.chauffeurId) : null,
      currentMissions: mockData.missions.filter(m => 
        m.camionId === id && m.statut === StatutMission.EN_COURS
      ),
      totalMissions: mockData.missions.filter(m => m.camionId === id).length,
      completedMissions: mockData.missions.filter(m => 
        m.camionId === id && m.statut === StatutMission.TERMINEE
      ).length
    }
    
    return NextResponse.json({
      success: true,
      data: enrichedVehicle,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération du véhicule:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération du véhicule' 
      },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un véhicule spécifique
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    const vehicleIndex = mockData.camions.findIndex(v => v.id === id)
    
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Véhicule non trouvé' 
        },
        { status: 404 }
      )
    }
    
    // Vérifier s'il y a des missions actives avant modification
    const activeMissions = mockData.missions.filter(m => 
      m.camionId === id && m.statut === StatutMission.EN_COURS
    )
    
    if (activeMissions.length > 0 && body.statut && body.statut !== 'EN_MISSION') {
      return NextResponse.json(
        { success: false, error: 'Impossible de modifier: missions actives en cours' },
        { status: 409 }
      )
    }
    
    // Mise à jour avec gestion des alias
    const updatedVehicle = {
      ...mockData.camions[vehicleIndex],
      ...body,
      id, // S'assurer que l'ID ne change pas
      capaciteCiterne: body.capaciteCiterne || body.capacite || mockData.camions[vehicleIndex].capaciteCiterne,
      odometre: body.odometre || body.kilometrage || mockData.camions[vehicleIndex].odometre,
      updatedAt: new Date()
    }
    
    // Gérer les alias pour compatibilité
    updatedVehicle.capacite = updatedVehicle.capaciteCiterne
    updatedVehicle.kilometrage = updatedVehicle.odometre
    
    mockData.camions[vehicleIndex] = updatedVehicle
    
    return NextResponse.json({
      success: true,
      data: updatedVehicle,
      message: 'Véhicule mis à jour avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du véhicule:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la mise à jour du véhicule' 
      },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un véhicule spécifique
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    const vehicleIndex = mockData.camions.findIndex(v => v.id === id)
    
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Véhicule non trouvé' 
        },
        { status: 404 }
      )
    }
    
    // Vérifier s'il y a des missions actives
    const activeMissions = mockData.missions.filter(m => 
      m.camionId === id && m.statut === StatutMission.EN_COURS
    )
    
    if (activeMissions.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Impossible de supprimer: missions actives en cours' },
        { status: 409 }
      )
    }
    
    // Libérer le chauffeur assigné
    const vehicle = mockData.camions[vehicleIndex]
    if (vehicle.chauffeurId) {
      const driver = mockData.chauffeurs.find(d => d.id === vehicle.chauffeurId)
      if (driver) {
        driver.disponible = true
      }
    }
    
    // Supprimer le véhicule
    const deletedVehicle = mockData.camions.splice(vehicleIndex, 1)[0]
    
    return NextResponse.json({
      success: true,
      data: deletedVehicle,
      message: 'Véhicule supprimé avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la suppression du véhicule' 
      },
      { status: 500 }
    )
  }
} 