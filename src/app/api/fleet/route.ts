import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/db/mock-data'

// GET - Récupérer tous les véhicules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    
    let vehicles = mockData.camions
    
    // Filtrer par statut si spécifié
    if (status) {
      vehicles = vehicles.filter(v => v.statut === status)
    }
    
    // Filtrer par type si spécifié
    if (type) {
      vehicles = vehicles.filter(v => v.type === type)
    }
    
    return NextResponse.json({
      success: true,
      data: vehicles,
      total: vehicles.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des véhicules' 
      },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau véhicule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.immatriculation || !body.modele || !body.type) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données manquantes: immatriculation, modele et type sont requis' 
        },
        { status: 400 }
      )
    }
    
    // Générer un nouvel ID
    const newId = `V${Date.now()}`
    
    const newVehicle = {
      id: newId,
      immatriculation: body.immatriculation,
      modele: body.modele,
      type: body.type,
      statut: body.statut || 'disponible',
      capacite: body.capacite || 0,
      kilometrage: body.kilometrage || 0,
      derniereMaintenance: body.derniereMaintenance || new Date().toISOString().split('T')[0],
      prochaineMaintenance: body.prochaineMaintenance || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      chauffeurId: body.chauffeurId || null,
      annee: body.annee || new Date().getFullYear(),
      createdAt: new Date().toISOString()
    }
    
    // Ajouter à la base de données mock (en réalité, ça serait persisté)
    mockData.camions.push(newVehicle)
    
    return NextResponse.json({
      success: true,
      data: newVehicle,
      message: 'Véhicule créé avec succès'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création du véhicule' 
      },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un véhicule
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID du véhicule requis' 
        },
        { status: 400 }
      )
    }
    
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
      ...updateData,
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

// DELETE - Supprimer un véhicule
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID du véhicule requis' 
        },
        { status: 400 }
      )
    }
    
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