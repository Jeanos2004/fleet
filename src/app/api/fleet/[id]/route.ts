import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/db/mock-data'

// GET - Récupérer un véhicule par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
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
    
    // Ajouter des informations supplémentaires
    const vehicleWithDetails = {
      ...vehicle,
      missions: mockData.missions.filter(m => m.camionId === id),
      maintenanceHistory: mockData.maintenances?.filter(m => m.vehicleId === id) || [],
      driver: vehicle.chauffeurId ? mockData.chauffeurs.find(c => c.id === vehicle.chauffeurId) : null
    }
    
    return NextResponse.json({
      success: true,
      data: vehicleWithDetails,
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
    const { id } = params
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
    
    // Mettre à jour le véhicule
    mockData.camions[vehicleIndex] = {
      ...mockData.camions[vehicleIndex],
      ...body,
      id, // S'assurer que l'ID ne change pas
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockData.camions[vehicleIndex],
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
    const { id } = params
    
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
    
    // Vérifier si le véhicule est utilisé dans des missions actives
    const activeMissions = mockData.missions.filter(
      m => m.camionId === id && m.statut === 'en_cours'
    )
    
    if (activeMissions.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Impossible de supprimer: le véhicule a des missions actives' 
        },
        { status: 400 }
      )
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