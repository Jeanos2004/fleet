import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/db/mock-data'
import { StatutMission } from '@/types'

// GET - Récupérer tous les chauffeurs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const available = searchParams.get('available')
    
    let drivers = [...mockData.chauffeurs]
    
    // Filtrer par statut si fourni
    if (status) {
      drivers = drivers.filter(d => d.statut === status)
    }
    
    // Filtrer par disponibilité
    if (available === 'true') {
      drivers = drivers.filter(d => d.disponible)
    }
    
    // Enrichir avec des données supplémentaires
    const enrichedDrivers = drivers.map(driver => ({
      ...driver,
      currentVehicle: mockData.camions.find(c => c.chauffeurId === driver.id),
      activeMissions: mockData.missions.filter(m => m.chauffeurId === driver.id && m.statut === StatutMission.EN_COURS).length,
      totalMissions: mockData.missions.filter(m => m.chauffeurId === driver.id).length,
      rating: driver.rating || 5.0
    }))
    
    return NextResponse.json({
      success: true,
      data: enrichedDrivers,
      count: enrichedDrivers.length
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des chauffeurs:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau chauffeur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.nom || !body.prenom || !body.telephone || !body.numeroPermis) {
      return NextResponse.json(
        { success: false, error: 'Données manquantes' },
        { status: 400 }
      )
    }
    
    // Vérifier l'unicité de l'email si fourni
    if (body.email) {
      const existingDriver = mockData.chauffeurs.find(d => d.email === body.email)
      if (existingDriver) {
        return NextResponse.json(
          { success: false, error: 'Un chauffeur avec cet email existe déjà' },
          { status: 409 }
        )
      }
    }
    
    // Créer un nouveau chauffeur
    const newDriver = {
      id: Date.now().toString(),
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      telephone: body.telephone,
      numeroPermis: body.numeroPermis,
      dateExpirationPermis: new Date(body.dateExpirationPermis),
      statut: body.statut || 'disponible',
      dateEmbauche: body.dateEmbauche ? new Date(body.dateEmbauche) : new Date(),
      adresse: body.adresse,
      dateNaissance: body.dateNaissance ? new Date(body.dateNaissance) : undefined,
      experience: body.experience || 0,
      rating: body.rating || 5.0,
      disponible: body.disponible !== undefined ? body.disponible : true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockData.chauffeurs.push(newDriver)
    
    return NextResponse.json({
      success: true,
      data: newDriver,
      message: 'Chauffeur créé avec succès'
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du chauffeur:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un chauffeur
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
    
    const driverIndex = mockData.chauffeurs.findIndex(d => d.id === id)
    if (driverIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Chauffeur non trouvé' },
        { status: 404 }
      )
    }
    
    // Mise à jour
    const updatedDriver = {
      ...mockData.chauffeurs[driverIndex],
      ...body,
      id, // S'assurer que l'ID ne change pas
      updatedAt: new Date()
    }
    
    mockData.chauffeurs[driverIndex] = updatedDriver
    
    return NextResponse.json({
      success: true,
      data: updatedDriver,
      message: 'Chauffeur mis à jour avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour du chauffeur:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un chauffeur
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
    
    // Vérifier s'il y a des missions actives
    const activeMissions = mockData.missions.filter(
      m => m.chauffeurId === id && m.statut === StatutMission.EN_COURS
    )
    
    if (activeMissions.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Impossible de supprimer: missions actives en cours' },
        { status: 409 }
      )
    }
    
    const driverIndex = mockData.chauffeurs.findIndex(d => d.id === id)
    if (driverIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Chauffeur non trouvé' },
        { status: 404 }
      )
    }
    
    // Libérer le véhicule assigné
    const vehicle = mockData.camions.find(v => v.chauffeurId === id)
    if (vehicle) {
      vehicle.chauffeurId = null
    }
    
    // Supprimer le chauffeur
    mockData.chauffeurs.splice(driverIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Chauffeur supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur lors de la suppression du chauffeur:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
} 