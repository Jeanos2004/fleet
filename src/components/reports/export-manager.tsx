"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PDFGenerator } from '@/lib/exports/pdf-generator'
import { ExcelGenerator } from '@/lib/exports/excel-generator'
import { mockMissions, mockMarketeurs, mockCamions } from '@/lib/db/mock-data'
import { formatDate } from '@/lib/utils'
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Calendar, 
  Truck, 
  Wrench,
  DollarSign,
  Loader2
} from 'lucide-react'

interface ExportOption {
  id: string
  name: string
  description: string
  type: 'PDF' | 'Excel'
  icon: any
  category: 'missions' | 'fleet' | 'maintenance' | 'financial'
}

const exportOptions: ExportOption[] = [
  {
    id: 'missions-pdf',
    name: 'Rapport des Missions (PDF)',
    description: 'Rapport détaillé des missions avec statistiques',
    type: 'PDF',
    icon: FileText,
    category: 'missions'
  },
  {
    id: 'missions-excel',
    name: 'Données des Missions (Excel)',
    description: 'Export complet des données de missions',
    type: 'Excel',
    icon: FileSpreadsheet,
    category: 'missions'
  },
  {
    id: 'fleet-pdf',
    name: 'Rapport de Flotte (PDF)',
    description: 'État complet de la flotte de camions',
    type: 'PDF',
    icon: FileText,
    category: 'fleet'
  },
  {
    id: 'fleet-excel',
    name: 'Données de Flotte (Excel)',
    description: 'Export détaillé des camions et statistiques',
    type: 'Excel',
    icon: FileSpreadsheet,
    category: 'fleet'
  },
  {
    id: 'maintenance-pdf',
    name: 'Rapport de Maintenance (PDF)',
    description: 'Rapport des ordres de travail et maintenance',
    type: 'PDF',
    icon: FileText,
    category: 'maintenance'
  },
  {
    id: 'maintenance-excel',
    name: 'Données de Maintenance (Excel)',
    description: 'Export des ordres de travail et coûts',
    type: 'Excel',
    icon: FileSpreadsheet,
    category: 'maintenance'
  }
]

const categoryIcons = {
  missions: Calendar,
  fleet: Truck,
  maintenance: Wrench,
  financial: DollarSign
}

const categoryLabels = {
  missions: 'Missions',
  fleet: 'Flotte',
  maintenance: 'Maintenance',
  financial: 'Financier'
}

export function ExportManager() {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [exportHistory, setExportHistory] = useState<Array<{
    id: string
    name: string
    date: Date
    size: string
  }>>([])

  const handleExport = async (option: ExportOption) => {
    setIsExporting(option.id)
    
    try {
      let filename = ''
      let blob: Blob | null = null

      switch (option.id) {
        case 'missions-pdf':
          const missionsPDF = new PDFGenerator()
          missionsPDF.generateMissionReport(mockMissions, mockMarketeurs, mockCamions)
          filename = `missions-rapport-${formatDate(new Date()).replace(/\//g, '-')}.pdf`
          blob = missionsPDF.getBlob()
          break

        case 'missions-excel':
          const missionsExcel = new ExcelGenerator()
          missionsExcel.generateMissionsReport(mockMissions, mockMarketeurs, mockCamions)
          filename = `missions-donnees-${formatDate(new Date()).replace(/\//g, '-')}.xlsx`
          blob = missionsExcel.getBlob()
          break

        case 'fleet-pdf':
          const fleetPDF = new PDFGenerator()
          fleetPDF.generateFleetReport(mockCamions)
          filename = `flotte-rapport-${formatDate(new Date()).replace(/\//g, '-')}.pdf`
          blob = fleetPDF.getBlob()
          break

        case 'fleet-excel':
          const fleetExcel = new ExcelGenerator()
          fleetExcel.generateFleetReport(mockCamions)
          filename = `flotte-donnees-${formatDate(new Date()).replace(/\//g, '-')}.xlsx`
          blob = fleetExcel.getBlob()
          break

        case 'maintenance-pdf':
          // Données mockées pour la maintenance
          const mockWorkOrders = [
            {
              id: 'WO-001',
              camionId: '1',
              type: 'PREVENTIVE',
              statut: 'TERMINEE',
              description: 'Révision 10 000 km',
              dateCreation: new Date('2024-03-01'),
              dateDebut: new Date('2024-03-05'),
              dateFin: new Date('2024-03-05'),
              cout: 467.50,
              pieces: [],
              validee: true
            }
          ]
          const maintenancePDF = new PDFGenerator()
          maintenancePDF.generateMaintenanceReport(mockWorkOrders, mockCamions)
          filename = `maintenance-rapport-${formatDate(new Date()).replace(/\//g, '-')}.pdf`
          blob = maintenancePDF.getBlob()
          break

        case 'maintenance-excel':
          const mockWorkOrdersExcel = [
            {
              id: 'WO-001',
              camionId: '1',
              type: 'PREVENTIVE',
              statut: 'TERMINEE',
              description: 'Révision 10 000 km',
              dateCreation: new Date('2024-03-01'),
              dateDebut: new Date('2024-03-05'),
              dateFin: new Date('2024-03-05'),
              cout: 467.50,
              pieces: [],
              validee: true
            }
          ]
          const maintenanceExcel = new ExcelGenerator()
          maintenanceExcel.generateMaintenanceReport(mockWorkOrdersExcel, mockCamions)
          filename = `maintenance-donnees-${formatDate(new Date()).replace(/\//g, '-')}.xlsx`
          blob = maintenanceExcel.getBlob()
          break
      }

      if (blob) {
        // Télécharger le fichier
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        // Ajouter à l'historique
        setExportHistory(prev => [{
          id: Date.now().toString(),
          name: filename,
          date: new Date(),
          size: `${(blob.size / 1024).toFixed(1)} KB`
        }, ...prev.slice(0, 9)]) // Garder seulement les 10 derniers
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
    } finally {
      setIsExporting(null)
    }
  }

  const groupedOptions = exportOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = []
    }
    acc[option.category].push(option)
    return acc
  }, {} as Record<string, ExportOption[]>)

  return (
    <div className="space-y-6">
      {/* Options d'export par catégorie */}
      {Object.entries(groupedOptions).map(([category, options]) => {
        const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5 text-primary" />
                {categoryLabels[category as keyof typeof categoryLabels]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option) => {
                  const IconComponent = option.icon
                  const isCurrentlyExporting = isExporting === option.id
                  
                  return (
                    <div key={option.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${option.type === 'PDF' ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
                          <IconComponent className={`h-5 w-5 ${option.type === 'PDF' ? 'text-red-600' : 'text-green-600'}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-foreground">{option.name}</h3>
                            <Badge variant="outline">
                              {option.type}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {option.description}
                          </p>
                          
                          <Button
                            size="sm"
                            onClick={() => handleExport(option)}
                            disabled={isCurrentlyExporting}
                            className="flex items-center gap-2"
                          >
                            {isCurrentlyExporting ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3" />
                            )}
                            {isCurrentlyExporting ? 'Export...' : 'Télécharger'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Historique des exports */}
      {exportHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Historique des Exports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {exportHistory.map((export_) => (
                <div key={export_.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{export_.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(export_.date)} • {export_.size}
                    </p>
                  </div>
                  <Badge variant="outline">
                    Téléchargé
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 