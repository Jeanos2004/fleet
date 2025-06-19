"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { History, Calendar, Wrench, DollarSign, Download, Filter, Search } from 'lucide-react'

interface MaintenanceHistoryItem {
  id: string
  vehicleId: string
  vehiclePlate: string
  date: string
  type: 'preventive' | 'corrective' | 'emergency'
  title: string
  description: string
  technician: string
  workshop: string
  mileage: number
  totalCost: number
  partsCost: number
  laborCost: number
  duration: number
  partsReplaced: string[]
  notes?: string
}

const mockMaintenanceHistory: MaintenanceHistoryItem[] = [
  {
    id: '1',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    date: '2024-03-10',
    type: 'preventive',
    title: 'Vidange moteur complète',
    description: 'Vidange huile moteur, remplacement filtres à huile et à air, contrôle niveaux',
    technician: 'Lucas Moreau',
    workshop: 'Garage Central',
    mileage: 85000,
    totalCost: 485,
    partsCost: 120,
    laborCost: 365,
    duration: 2.5,
    partsReplaced: ['Filtre à huile', 'Filtre à air', 'Huile moteur 10W40'],
    notes: 'Véhicule en excellent état général'
  },
  {
    id: '2',
    vehicleId: 'v2',
    vehiclePlate: 'TC-002-FR',
    date: '2024-02-28',
    type: 'corrective',
    title: 'Réparation système freinage',
    description: 'Remplacement plaquettes et disques de frein avant suite à usure importante',
    technician: 'Pierre Duval',
    workshop: 'Atelier Poids Lourds',
    mileage: 140000,
    totalCost: 1250,
    partsCost: 750,
    laborCost: 500,
    duration: 4,
    partsReplaced: ['Plaquettes avant', 'Disques avant', 'Liquide de frein'],
    notes: 'Freins arrière OK, prévoir contrôle dans 6 mois'
  },
  {
    id: '3',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    date: '2024-01-15',
    type: 'emergency',
    title: 'Réparation d\'urgence - panne hydraulique',
    description: 'Fuite hydraulique importante, remplacement flexible et pompe',
    technician: 'Antoine Bernard',
    workshop: 'Service Express',
    mileage: 82000,
    totalCost: 1800,
    partsCost: 1200,
    laborCost: 600,
    duration: 6,
    partsReplaced: ['Pompe hydraulique', 'Flexibles haute pression', 'Joints d\'étanchéité'],
    notes: 'Intervention d\'urgence - véhicule immobilisé 24h'
  }
]

export default function MaintenanceHistoryPage() {
  const [historyItems] = useState<MaintenanceHistoryItem[]>(mockMaintenanceHistory)
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [vehicleFilter, setVehicleFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredHistory = historyItems.filter(item => {
    const typeMatch = typeFilter === 'all' || item.type === typeFilter
    const vehicleMatch = vehicleFilter === 'all' || item.vehicleId === vehicleFilter
    const searchMatch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.technician.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.workshop.toLowerCase().includes(searchTerm.toLowerCase())
    return typeMatch && vehicleMatch && searchMatch
  })

  const getTypeBadge = (type: MaintenanceHistoryItem['type']) => {
    const typeConfig = {
      preventive: { label: 'Préventive', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      corrective: { label: 'Corrective', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      emergency: { label: 'Urgence', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' }
    }
    
    const config = typeConfig[type]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const historyStats = {
    total: historyItems.length,
    totalCost: historyItems.reduce((sum, item) => sum + item.totalCost, 0),
    avgCost: historyItems.reduce((sum, item) => sum + item.totalCost, 0) / historyItems.length,
    totalHours: historyItems.reduce((sum, item) => sum + item.duration, 0),
    preventive: historyItems.filter(item => item.type === 'preventive').length,
    corrective: historyItems.filter(item => item.type === 'corrective').length,
    emergency: historyItems.filter(item => item.type === 'emergency').length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Historique de Maintenance</h1>
          <p className="text-muted-foreground">
            Consultez l&apos;historique complet des interventions de maintenance
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter historique
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <History className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{historyStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Préventive</p>
                <p className="text-2xl font-bold text-foreground">{historyStats.preventive}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Corrective</p>
                <p className="text-2xl font-bold text-foreground">{historyStats.corrective}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Urgence</p>
                <p className="text-2xl font-bold text-foreground">{historyStats.emergency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Coût total</p>
                <p className="text-2xl font-bold text-foreground">{historyStats.totalCost.toLocaleString()} €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <span className="text-orange-600 font-bold">Ø</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Coût moyen</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(historyStats.avgCost)} €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⏱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total heures</p>
                <p className="text-2xl font-bold text-foreground">{historyStats.totalHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher dans l'historique..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
        <select
          value={vehicleFilter}
          onChange={(e) => setVehicleFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les véhicules</option>
          <option value="v1">TC-001-FR</option>
          <option value="v2">TC-002-FR</option>
          <option value="v3">TC-003-FR</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les types</option>
          <option value="preventive">Préventive</option>
          <option value="corrective">Corrective</option>
          <option value="emergency">Urgence</option>
        </select>
      </div>

      {/* History Items */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    {getTypeBadge(item.type)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{item.vehiclePlate}</span>
                    <span>•</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{item.mileage.toLocaleString()} km</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{item.totalCost} €</p>
                  <p className="text-sm text-muted-foreground">{item.duration}h de travail</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Service Details */}
                <div>
                  <h4 className="font-medium mb-2">Détails intervention</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Technicien:</span> {item.technician}</p>
                    <p><span className="text-muted-foreground">Atelier:</span> {item.workshop}</p>
                    <p><span className="text-muted-foreground">Durée:</span> {item.duration}h</p>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h4 className="font-medium mb-2">Répartition des coûts</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pièces:</span>
                      <span>{item.partsCost} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Main d&apos;œuvre:</span>
                      <span>{item.laborCost} €</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Total:</span>
                      <span>{item.totalCost} €</span>
                    </div>
                  </div>
                </div>

                {/* Parts Replaced */}
                <div>
                  <h4 className="font-medium mb-2">Pièces remplacées</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.partsReplaced.map((part, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {part}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse des coûts par mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-16 h-16 bg-chart-1 opacity-20 rounded-lg mx-auto mb-4" />
              <p>Graphique d&apos;évolution des coûts</p>
              <p className="text-sm">Intégration Chart.js/Recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 