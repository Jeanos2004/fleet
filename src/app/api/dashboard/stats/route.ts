import { NextRequest, NextResponse } from 'next/server'
import { mockData } from '@/lib/db/mock-data'

// GET - Récupérer les statistiques du dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // Période en jours
    const periodDays = parseInt(period)
    
    const now = new Date()
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)
    
    // Statistiques des véhicules
    const totalVehicles = mockData.camions.length
    const availableVehicles = mockData.camions.filter(v => v.statut === 'disponible').length
    const activeVehicles = mockData.camions.filter(v => v.statut === 'en_mission').length
    const maintenanceVehicles = mockData.camions.filter(v => v.statut === 'maintenance').length
    
    // Statistiques des chauffeurs
    const totalDrivers = mockData.chauffeurs.length
    const availableDrivers = mockData.chauffeurs.filter(d => d.statut === 'disponible').length
    const activeDrivers = mockData.chauffeurs.filter(d => d.statut === 'en_mission').length
    
    // Statistiques des missions
    const totalMissions = mockData.missions.length
    const activeMissions = mockData.missions.filter(m => m.statut === 'en_cours').length
    const completedMissions = mockData.missions.filter(m => m.statut === 'terminee').length
    const plannedMissions = mockData.missions.filter(m => m.statut === 'planifiee').length
    
    // Missions de la période
    const periodMissions = mockData.missions.filter(m => {
      const missionDate = new Date(m.dateDebut)
      return missionDate >= startDate && missionDate <= now
    })
    
    // Calcul du taux de réussite
    const successRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0
    
    // Calcul des revenus (simulation)
    const totalRevenue = periodMissions.reduce((sum, mission) => {
      // Simulation d'un prix basé sur la distance et le type de carburant
      const basePrice = mission.type === 'essence' ? 1.5 : mission.type === 'diesel' ? 1.3 : 1.4
      return sum + (mission.quantite * basePrice)
    }, 0)
    
    // Calcul de la consommation de carburant
    const totalFuelConsumption = periodMissions.reduce((sum, mission) => {
      // Simulation: 30L/100km en moyenne
      return sum + (mission.distance * 0.3)
    }, 0)
    
    // Calcul du kilométrage total
    const totalMileage = periodMissions.reduce((sum, mission) => sum + mission.distance, 0)
    
    // Évolution journalière des missions (derniers 7 jours)
    const dailyMissions = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayMissions = mockData.missions.filter(m => {
        const missionDate = new Date(m.dateDebut)
        return missionDate >= dayStart && missionDate <= dayEnd
      })
      
      dailyMissions.push({
        date: dayStart.toISOString().split('T')[0],
        missions: dayMissions.length,
        completed: dayMissions.filter(m => m.statut === 'terminee').length,
        revenue: dayMissions.reduce((sum, mission) => {
          const basePrice = mission.type === 'essence' ? 1.5 : mission.type === 'diesel' ? 1.3 : 1.4
          return sum + (mission.quantite * basePrice)
        }, 0)
      })
    }
    
    // Répartition par type de carburant
    const fuelTypeDistribution = {
      essence: periodMissions.filter(m => m.type === 'essence').length,
      diesel: periodMissions.filter(m => m.type === 'diesel').length,
      gaz: periodMissions.filter(m => m.type === 'gaz').length
    }
    
    // Top 5 des chauffeurs par nombre de missions
    const driverStats = mockData.chauffeurs.map(driver => ({
      id: driver.id,
      name: `${driver.prenom} ${driver.nom}`,
      missions: periodMissions.filter(m => m.chauffeurId === driver.id).length,
      rating: driver.rating || 5.0
    })).sort((a, b) => b.missions - a.missions).slice(0, 5)
    
    // Alertes et notifications
    const alerts = []
    
    // Véhicules nécessitant une maintenance
    const maintenanceDue = mockData.camions.filter(v => {
      const nextMaintenance = new Date(v.prochaineMaintenance)
      const warningDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 jours
      return nextMaintenance <= warningDate
    })
    
    if (maintenanceDue.length > 0) {
      alerts.push({
        type: 'maintenance',
        severity: 'warning',
        message: `${maintenanceDue.length} véhicule(s) nécessitent une maintenance prochainement`,
        count: maintenanceDue.length
      })
    }
    
    // Missions en retard
    const overdueMissions = mockData.missions.filter(m => {
      const endDate = new Date(m.dateFin)
      return m.statut === 'en_cours' && endDate < now
    })
    
    if (overdueMissions.length > 0) {
      alerts.push({
        type: 'mission',
        severity: 'error',
        message: `${overdueMissions.length} mission(s) en retard`,
        count: overdueMissions.length
      })
    }
    
    const stats = {
      // Statistiques générales
      vehicles: {
        total: totalVehicles,
        available: availableVehicles,
        active: activeVehicles,
        maintenance: maintenanceVehicles,
        utilizationRate: totalVehicles > 0 ? (activeVehicles / totalVehicles) * 100 : 0
      },
      drivers: {
        total: totalDrivers,
        available: availableDrivers,
        active: activeDrivers,
        utilizationRate: totalDrivers > 0 ? (activeDrivers / totalDrivers) * 100 : 0
      },
      missions: {
        total: totalMissions,
        active: activeMissions,
        completed: completedMissions,
        planned: plannedMissions,
        successRate: Math.round(successRate * 100) / 100,
        periodTotal: periodMissions.length
      },
      performance: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalMileage: Math.round(totalMileage * 100) / 100,
        totalFuelConsumption: Math.round(totalFuelConsumption * 100) / 100,
        averageFuelEfficiency: totalMileage > 0 ? Math.round((totalFuelConsumption / totalMileage) * 100 * 100) / 100 : 0
      },
      trends: {
        dailyMissions,
        fuelTypeDistribution,
        topDrivers: driverStats
      },
      alerts,
      period: {
        days: periodDays,
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
      },
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      data: stats
    })
    
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération des statistiques' 
      },
      { status: 500 }
    )
  }
} 