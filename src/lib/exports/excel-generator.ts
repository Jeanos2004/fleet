import * as XLSX from 'xlsx'
import { Mission, Camion } from '@/types'

export class ExcelGenerator {
  static async generateMissionsReport(missions: Mission[]): Promise<Blob> {
    const data = missions.map(mission => ({
      'ID Mission': mission.id,
      'Type': mission.type,
      'Statut': mission.statut,
      'Date Début': mission.dateDebut.toLocaleDateString('fr-FR'),
      'Date Fin': mission.dateFin?.toLocaleDateString('fr-FR') || 'En cours',
      'Distance Estimée (km)': mission.distanceEstimee,
      'Coût Total (€)': mission.fraisEstimes.total,
      'Validée': mission.validee ? 'Oui' : 'Non',
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Missions')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
  }

  static async generateFleetReport(camions: Camion[]): Promise<Blob> {
    const data = camions.map(camion => ({
      'Immatriculation': camion.immatriculation,
      'Marque': camion.marque,
      'Modèle': camion.modele,
      'Capacité (L)': camion.capaciteCiterne,
      'Odomètre (km)': camion.odometre,
      'Statut': camion.statut,
      'Disponible': camion.disponible ? 'Oui' : 'Non',
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Flotte')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
  }

  static downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
} 