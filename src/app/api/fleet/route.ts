import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/db/mock-data'
import { StatutCamion } from '@/types'

// GET - Récupérer tous les véhicules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const typeFilter = searchParams.get('type')
    
    let vehicles = [...mockData.camions]
    
    // Filtrer par statut
    if (status) {
      vehicles = vehicles.filter(v => v.statut.toString() === status.toUpperCase())
    }
    
    // Filtrer par type si fourni
    if (typeFilter) {
      vehicles = vehicles.filter(v => v.type === typeFilter)
    }
    
    // Enrichir avec des données supplémentaires
    const enrichedVehicles = vehicles.map(vehicle => ({
      ...vehicle,
      capacite: vehicle.capaciteCiterne, // Alias pour compatibilité
      kilometrage: vehicle.odometre, // Alias pour compatibilité
      driver: vehicle.chauffeurId ? 
        mockData.chauffeurs.find(c => c.id === vehicle.chauffeurId) : null,
      activeMissions: mockData.missions.filter(m => 
        m.camionId === vehicle.id && 
        m.statut.toString().includes('EN_COURS')
      ).length
    }))
    
    return NextResponse.json({
      success: true,
      data: enrichedVehicles,
      count: enrichedVehicles.length
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de la flotte:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau véhicule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.immatriculation || !body.marque || !body.modele) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      )
    }
    
    // Vérifier l'unicité de l'immatriculation
    const existingVehicle = mockData.camions.find(v => v.immatriculation === body.immatriculation)
    if (existingVehicle) {
      return NextResponse.json(
        { success: false, error: 'Un véhicule avec cette immatriculation existe déjà' },
        { status: 409 }
      )
    }
    
    // Créer un nouveau véhicule
    const newVehicle = {
      id: Date.now().toString(),
      immatriculation: body.immatriculation,
      marque: body.marque,
      modele: body.modele,
      type: body.type,
      annee: body.annee,
      capaciteCiterne: body.capaciteCiterne || body.capacite || 35000,
      capacite: body.capacite || body.capaciteCiterne || 35000,
      odometre: body.odometre || body.kilometrage || 0,
      kilometrage: body.kilometrage || body.odometre || 0,
      statut: body.statut ? StatutCamion[body.statut.toUpperCase() as keyof typeof StatutCamion] : StatutCamion.DISPONIBLE,
      prochaineMaintenance: body.prochaineMaintenance ? new Date(body.prochaineMaintenance) : new Date(),
      derniereMaintenance: body.derniereMaintenance ? new Date(body.derniereMaintenance) : undefined,
      chauffeurId: body.chauffeurId || null,
      disponible: body.disponible !== undefined ? body.disponible : true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockData.camions.push(newVehicle)
    
    return NextResponse.json({
      success: true,
      data: newVehicle,
      message: 'Véhicule créé avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un véhicule
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID manquant' },
        { status: 400 }
      )
    }
    
    const vehicleIndex = mockData.camions.findIndex(v => v.id === id)
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Véhicule non trouvé' },
        { status: 404 }
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
      { success: false, error: 'Erreur serveur' },
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
        { success: false, error: 'ID manquant' },
        { status: 400 }
      )
    }
    
    const vehicleIndex = mockData.camions.findIndex(v => v.id === id)
    if (vehicleIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Véhicule non trouvé' },
        { status: 404 }
      )
    }
    
    // Vérifier s'il y a des missions actives
    const activeMissions = mockData.missions.filter(m => 
      m.camionId === id && m.statut.toString().includes('EN_COURS')
    )
    
    if (activeMissions.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Impossible de supprimer: missions actives en cours' },
        { status: 409 }
      )
    }
    
    // Supprimer le véhicule
    mockData.camions.splice(vehicleIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Véhicule supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 