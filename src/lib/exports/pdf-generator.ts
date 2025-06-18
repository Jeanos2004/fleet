import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Mission, Camion, Marketeur } from '@/types'
import { formatDate, formatCurrency } from '@/lib/utils'

// Extension du type jsPDF pour inclure autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
    lastAutoTable: {
      finalY: number
    }
  }
}

export class PDFGenerator {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF()
    this.setupFonts()
  }

  private setupFonts() {
    this.doc.setFont('helvetica')
  }

  private addHeader(title: string, subtitle?: string) {
    // Logo et titre
    this.doc.setFontSize(20)
    this.doc.setTextColor(37, 99, 235) // Couleur primary
    this.doc.text('Fleet Manager', 20, 25)
    
    this.doc.setFontSize(16)
    this.doc.setTextColor(0, 0, 0)
    this.doc.text(title, 20, 40)
    
    if (subtitle) {
      this.doc.setFontSize(12)
      this.doc.setTextColor(100, 100, 100)
      this.doc.text(subtitle, 20, 50)
    }
    
    // Date de génération
    this.doc.setFontSize(10)
    this.doc.text(`Généré le ${formatDate(new Date())}`, 20, subtitle ? 60 : 50)
    
    // Ligne de séparation
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(20, subtitle ? 65 : 55, 190, subtitle ? 65 : 55)
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(8)
      this.doc.setTextColor(100, 100, 100)
      this.doc.text(
        `Page ${i} sur ${pageCount}`,
        this.doc.internal.pageSize.width / 2,
        this.doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }
  }

  generateMissionReport(missions: Mission[], marketeurs: Marketeur[], camions: Camion[]) {
    this.addHeader('Rapport des Missions', `${missions.length} missions`)

    // Statistiques générales
    const totalDistance = missions.reduce((sum, m) => sum + (m.distanceReelle || m.distanceEstimee), 0)
    const totalCost = missions.reduce((sum, m) => sum + (m.fraisReels?.total || 0), 0)
    const completedMissions = missions.filter(m => m.statut === 'TERMINEE').length

    const stats = [
      ['Missions totales', missions.length.toString()],
      ['Missions terminées', completedMissions.toString()],
      ['Distance totale', `${totalDistance.toFixed(1)} km`],
      ['Coût total', formatCurrency(totalCost)],
      ['Coût moyen/km', formatCurrency(totalDistance > 0 ? totalCost / totalDistance : 0)]
    ]

    this.doc.autoTable({
      startY: 75,
      head: [['Statistique', 'Valeur']],
      body: stats,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 }
    })

    // Détail des missions
    const missionData = missions.map(mission => {
      // Récupérer le marketeur via le premier site de la mission
      const firstSite = mission.sites?.[0]
      const marketeur = firstSite ? marketeurs.find(m => m.id === firstSite.site?.marketeurId) : null
      const camion = camions.find(c => c.id === mission.camionId)
      
      return [
        mission.id,
        formatDate(mission.dateDebut),
        marketeur?.nom || 'N/A',
        camion?.immatriculation || 'N/A',
        mission.statut,
        `${mission.distanceReelle || mission.distanceEstimee} km`,
        formatCurrency(mission.fraisReels?.total || 0)
      ]
    })

    this.doc.autoTable({
      startY: this.doc.lastAutoTable.finalY + 20,
      head: [['ID Mission', 'Date', 'Marketeur', 'Camion', 'Statut', 'Distance', 'Coût']],
      body: missionData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 }
      }
    })

    this.addFooter()
    return this.doc
  }

  generateMaintenanceReport(workOrders: any[], camions: Camion[]) {
    this.addHeader('Rapport de Maintenance', `${workOrders.length} ordres de travail`)

    // Statistiques maintenance
    const totalCost = workOrders.reduce((sum, wo) => sum + (wo.cout || 0), 0)
    const completedOrders = workOrders.filter(wo => wo.statut === 'TERMINEE').length
    const avgCost = workOrders.length > 0 ? totalCost / workOrders.length : 0

    const stats = [
      ['Ordres totaux', workOrders.length.toString()],
      ['Ordres terminés', completedOrders.toString()],
      ['Coût total', formatCurrency(totalCost)],
      ['Coût moyen', formatCurrency(avgCost)],
      ['Taux de completion', `${Math.round((completedOrders / (workOrders.length || 1)) * 100)}%`]
    ]

    this.doc.autoTable({
      startY: 75,
      head: [['Statistique', 'Valeur']],
      body: stats,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    })

    // Détail des ordres de travail
    const orderData = workOrders.map(order => {
      const camion = camions.find(c => c.id === order.camionId)
      
      return [
        order.id,
        camion?.immatriculation || 'N/A',
        order.type === 'PREVENTIVE' ? 'Préventive' : 'Curative',
        order.statut,
        formatDate(order.dateCreation),
        order.dateFin ? formatDate(order.dateFin) : 'En cours',
        formatCurrency(order.cout || 0)
      ]
    })

    this.doc.autoTable({
      startY: this.doc.lastAutoTable.finalY + 20,
      head: [['ID Ordre', 'Camion', 'Type', 'Statut', 'Créé', 'Terminé', 'Coût']],
      body: orderData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    })

    this.addFooter()
    return this.doc
  }

  generateFleetReport(camions: Camion[]) {
    this.addHeader('Rapport de Flotte', `${camions.length} camions`)

    // Statistiques flotte
    const availableTrucks = camions.filter(c => c.disponible).length
    const totalOdometer = camions.reduce((sum, c) => sum + c.odometre, 0)
    const avgOdometer = camions.length > 0 ? totalOdometer / camions.length : 0
    const totalCapacity = camions.reduce((sum, c) => sum + c.capaciteCiterne, 0)

    const stats = [
      ['Camions totaux', camions.length.toString()],
      ['Camions disponibles', availableTrucks.toString()],
      ['Taux de disponibilité', `${Math.round((availableTrucks / (camions.length || 1)) * 100)}%`],
      ['Odomètre total', `${totalOdometer.toLocaleString()} km`],
      ['Odomètre moyen', `${Math.round(avgOdometer).toLocaleString()} km`],
      ['Capacité totale', `${totalCapacity.toLocaleString()} L`]
    ]

    this.doc.autoTable({
      startY: 75,
      head: [['Statistique', 'Valeur']],
      body: stats,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    })

    // Détail des camions
    const truckData = camions.map(camion => [
      camion.immatriculation,
      `${camion.marque} ${camion.modele}`,
      (camion.annee || new Date().getFullYear()).toString(),
      `${camion.capaciteCiterne.toLocaleString()} L`,
      `${camion.odometre.toLocaleString()} km`,
      camion.disponible ? 'Disponible' : 'Indisponible',
      formatDate(camion.prochaineMaintenance)
    ])

    this.doc.autoTable({
      startY: this.doc.lastAutoTable.finalY + 20,
      head: [['Immatriculation', 'Modèle', 'Année', 'Capacité', 'Odomètre', 'Statut', 'Prochaine Maintenance']],
      body: truckData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 }
    })

    this.addFooter()
    return this.doc
  }

  generateInvoice(marketeur: Marketeur, missions: Mission[], mois: number, annee: number) {
    this.addHeader('Facture', `${marketeur.nom} - ${mois.toString().padStart(2, '0')}/${annee}`)

    // Informations client
    this.doc.setFontSize(12)
    this.doc.text('Facturé à:', 20, 80)
    this.doc.setFontSize(10)
    this.doc.text(marketeur.nom, 20, 90)
    this.doc.text(marketeur.email, 20, 95)
    this.doc.text(marketeur.telephone, 20, 100)

    // Informations facture
    this.doc.text('Numéro de facture:', 120, 80)
    this.doc.text(`FACT-${annee}-${mois.toString().padStart(3, '0')}`, 120, 85)
    this.doc.text('Date d\'émission:', 120, 90)
    this.doc.text(formatDate(new Date()), 120, 95)

    // Détail des missions
    const missionData = missions.map((mission, index) => [
      (index + 1).toString(),
      mission.id,
      formatDate(mission.dateDebut),
      `${mission.distanceReelle || mission.distanceEstimee} km`,
      formatCurrency(mission.fraisReels?.total || 0)
    ])

    const total = missions.reduce((sum, m) => sum + (m.fraisReels?.total || 0), 0)
    const tva = total * 0.20 // 20% TVA
    const totalTTC = total + tva

    this.doc.autoTable({
      startY: 115,
      head: [['#', 'Mission', 'Date', 'Distance', 'Montant HT']],
      body: missionData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10 }
    })

    // Totaux
    const totalsY = this.doc.lastAutoTable.finalY + 10
    this.doc.autoTable({
      startY: totalsY,
      body: [
        ['Total HT', formatCurrency(total)],
        ['TVA (20%)', formatCurrency(tva)],
        ['Total TTC', formatCurrency(totalTTC)]
      ],
      theme: 'plain',
      styles: { fontSize: 12, fontStyle: 'bold' },
      columnStyles: {
        0: { halign: 'right', cellWidth: 140 },
        1: { halign: 'right', cellWidth: 40 }
      }
    })

    this.addFooter()
    return this.doc
  }

  save(filename: string) {
    this.doc.save(filename)
  }

  getBlob() {
    return this.doc.output('blob')
  }

  getDataUri() {
    return this.doc.output('datauristring')
  }
} 