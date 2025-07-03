import { mockData } from '@/lib/db/mock-data'
import { StatutCamion, StatutMission, TypeMission } from '@/types'

// GET - Récupérer les statistiques du dashboard
export async function GET() {
  try {
    // Statistiques des véhicules
    const availableVehicles = mockData.camions.filter(v => v.statut === StatutCamion.DISPONIBLE).length
    const activeVehicles = mockData.camions.filter(v => v.statut === StatutCamion.EN_MISSION).length
    const maintenanceVehicles = mockData.camions.filter(v => v.statut === StatutCamion.EN_MAINTENANCE).length

    // Statistiques des chauffeurs
    const availableDrivers = mockData.chauffeurs.filter(d => d.disponible).length
    const activeDrivers = mockData.chauffeurs.filter(d => !d.disponible).length

    // Statistiques des missions
    const activeMissions = mockData.missions.filter(m => m.statut === StatutMission.EN_COURS).length
    const completedMissions = mockData.missions.filter(m => m.statut === StatutMission.TERMINEE).length
    const plannedMissions = mockData.missions.filter(m => m.statut === StatutMission.PLANIFIEE).length

    // Période (30 derniers jours)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const periodMissions = mockData.missions.filter(m => m.dateDebut >= thirtyDaysAgo)

    // Coûts (simulation basée sur les données disponibles)
    const totalFuelCost = periodMissions.reduce((sum, mission) => {
      // Simulation basée sur la distance estimée
      const basePrice = 1.5 // prix moyen par litre
      const estimatedLiters = mission.distanceEstimee * 0.3 // 30L/100km
      return sum + (estimatedLiters * basePrice)
    }, 0)

    // Coûts de maintenance (simulation)
    const totalMaintenanceCost = periodMissions.reduce((sum, mission) => {
      return sum + (mission.distanceEstimee * 0.3)
    }, 0)

    // Kilométrage total
    const totalMileage = periodMissions.reduce((sum, mission) => sum + mission.distanceEstimee, 0)

    // Données des 7 derniers jours
    const weeklyData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayMissions = mockData.missions.filter(m => {
        const missionDate = new Date(m.dateDebut)
        return missionDate.toDateString() === date.toDateString()
      })

      weeklyData.push({
        date: date.toISOString().split('T')[0],
        completed: dayMissions.filter(m => m.statut === StatutMission.TERMINEE).length,
        revenue: dayMissions.reduce((sum, mission) => {
          const basePrice = 1.5
          const estimatedLiters = mission.distanceEstimee * 0.3
          return sum + (estimatedLiters * basePrice)
        }, 0)
      })
    }

    // Répartition par type de mission
    const fuelDistribution = {
      unique: periodMissions.filter(m => m.type === TypeMission.UNIQUE).length,
      multiple: periodMissions.filter(m => m.type === TypeMission.MULTIPLE).length,
      total: periodMissions.length
    }

    // Performance des chauffeurs
    const driverPerformance = mockData.chauffeurs.map(driver => ({
      id: driver.id,
      name: `${driver.prenom} ${driver.nom}`,
      rating: driver.rating || 5.0
    }))

    // Alertes (simulation)
    const alerts = []
    
    // Véhicules en maintenance
    if (maintenanceVehicles > 0) {
      alerts.push({
        type: 'warning',
        message: `${maintenanceVehicles} véhicule(s) en maintenance`
      })
    }

    // Missions en retard (missions qui devraient être terminées)
    const overdueMissions = mockData.missions.filter(m => {
      if (!m.dateFin || m.statut !== StatutMission.EN_COURS) return false
      const endDate = new Date(m.dateFin)
      return endDate < now
    }).length

    if (overdueMissions > 0) {
      alerts.push({
        type: 'error',
        message: `${overdueMissions} mission(s) en retard`
      })
    }

    return Response.json({
      vehicles: {
        total: mockData.camions.length,
        available: availableVehicles,
        active: activeVehicles,
        maintenance: maintenanceVehicles
      },
      drivers: {
        total: mockData.chauffeurs.length,
        available: availableDrivers,
        active: activeDrivers
      },
      missions: {
        total: mockData.missions.length,
        active: activeMissions,
        completed: completedMissions,
        planned: plannedMissions
      },
      costs: {
        fuel: Math.round(totalFuelCost * 100) / 100,
        maintenance: Math.round(totalMaintenanceCost * 100) / 100,
        total: Math.round((totalFuelCost + totalMaintenanceCost) * 100) / 100
      },
      mileage: {
        total: Math.round(totalMileage),
        average: Math.round(totalMileage / periodMissions.length) || 0
      },
      weeklyData,
      fuelDistribution,
      driverPerformance,
      alerts
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return Response.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 