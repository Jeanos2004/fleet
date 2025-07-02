import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/db/mock-data'

// GET - Récupérer tous les chauffeurs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const available = searchParams.get('available')
    
    let drivers = mockData.chauffeurs
    
    // Filtrer par statut si spécifié
    if (status) {
      drivers = drivers.filter(d => d.statut === status)
    }
    
    // Filtrer par disponibilité
    if (available === 'true') {
      drivers = drivers.filter(d => d.statut === 'disponible')
    }
    
    // Ajouter des informations supplémentaires pour chaque chauffeur
    const driversWithDetails = drivers.map(driver => ({
      ...driver,
      currentVehicle: mockData.camions.find(c => c.chauffeurId === driver.id),
      activeMissions: mockData.missions.filter(m => m.chauffeurId === driver.id && m.statut === 'en_cours').length,
      totalMissions: mockData.missions.filter(m => m.chauffeurId === driver.id).length
    }))
    
    return NextResponse.json({
      success: true,
      data: driversWithDetails,
      total: driversWithDetails.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des chauffeurs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des chauffeurs' 
      },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau chauffeur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation basique
    if (!body.nom || !body.prenom || !body.email || !body.telephone) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données manquantes: nom, prenom, email et telephone sont requis' 
        },
        { status: 400 }
      )
    }
    
    // Vérifier si l'email existe déjà
    const existingDriver = mockData.chauffeurs.find(d => d.email === body.email)
    if (existingDriver) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Un chauffeur avec cet email existe déjà' 
        },
        { status: 400 }
      )
    }
    
    // Générer un nouvel ID
    const newId = `D${Date.now()}`
    
    const newDriver = {
      id: newId,
      nom: body.nom,
      prenom: body.prenom,
      email: body.email,
      telephone: body.telephone,
      permis: body.permis || '',
      statut: body.statut || 'disponible',
      dateEmbauche: body.dateEmbauche || new Date().toISOString().split('T')[0],
      adresse: body.adresse || '',
      dateNaissance: body.dateNaissance || '',
      experience: body.experience || 0,
      rating: body.rating || 5.0,
      createdAt: new Date().toISOString()
    }
    
    // Ajouter à la base de données mock
    mockData.chauffeurs.push(newDriver)
    
    return NextResponse.json({
      success: true,
      data: newDriver,
      message: 'Chauffeur créé avec succès'
    }, { status: 201 })
    
  } catch (error) {
    console.error('Erreur lors de la création du chauffeur:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la création du chauffeur' 
      },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un chauffeur
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID du chauffeur requis' 
        },
        { status: 400 }
      )
    }
    
    const driverIndex = mockData.chauffeurs.findIndex(d => d.id === id)
    
    if (driverIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Chauffeur non trouvé' 
        },
        { status: 404 }
      )
    }
    
    // Mettre à jour le chauffeur
    mockData.chauffeurs[driverIndex] = {
      ...mockData.chauffeurs[driverIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: mockData.chauffeurs[driverIndex],
      message: 'Chauffeur mis à jour avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du chauffeur:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la mise à jour du chauffeur' 
      },
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
        { 
          success: false, 
          error: 'ID du chauffeur requis' 
        },
        { status: 400 }
      )
    }
    
    const driverIndex = mockData.chauffeurs.findIndex(d => d.id === id)
    
    if (driverIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Chauffeur non trouvé' 
        },
        { status: 404 }
      )
    }
    
    // Vérifier si le chauffeur a des missions actives
    const activeMissions = mockData.missions.filter(
      m => m.chauffeurId === id && m.statut === 'en_cours'
    )
    
    if (activeMissions.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Impossible de supprimer: le chauffeur a des missions actives' 
        },
        { status: 400 }
      )
    }
    
    // Supprimer le chauffeur
    const deletedDriver = mockData.chauffeurs.splice(driverIndex, 1)[0]
    
    // Libérer les véhicules assignés à ce chauffeur
    mockData.camions.forEach(vehicle => {
      if (vehicle.chauffeurId === id) {
        vehicle.chauffeurId = null
      }
    })
    
    return NextResponse.json({
      success: true,
      data: deletedDriver,
      message: 'Chauffeur supprimé avec succès'
    })
    
  } catch (error) {
    console.error('Erreur lors de la suppression du chauffeur:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la suppression du chauffeur' 
      },
      { status: 500 }
    )
  }
} 