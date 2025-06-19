"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRolePermissions, ProtectedComponent } from '@/hooks/use-role-permissions'
import { Truck, TrendingDown, AlertTriangle, CheckCircle, Plus, Search } from 'lucide-react'

interface ReplacementAnalysis {
  id: string
  vehiclePlate: string
  age: number
  mileage: number
  maintenanceCost: number
  efficiency: number
  score: number
  recommendation: 'keep' | 'monitor' | 'replace'
  nextMaintenance: string
}

const mockAnalysis: ReplacementAnalysis[] = [
  {
    id: '1',
    vehiclePlate: 'TC-001-FR',
    age: 8,
    mileage: 425000,
    maintenanceCost: 12500,
    efficiency: 2.8,
    score: 35,
    recommendation: 'replace',
    nextMaintenance: '2024-04-15'
  },
  {
    id: '2',
    vehiclePlate: 'TC-002-FR',
    age: 4,
    mileage: 189000,
    maintenanceCost: 4200,
    efficiency: 3.2,
    score: 78,
    recommendation: 'keep',
    nextMaintenance: '2024-05-20'
  }
]

export default function VehicleReplacementPage() {
  const [analysis] = useState<ReplacementAnalysis[]>(mockAnalysis)
  const [searchTerm, setSearchTerm] = useState('')

  const getRecommendationBadge = (recommendation: ReplacementAnalysis['recommendation']) => {
    const config = {
      keep: { label: 'Conserver', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700', icon: CheckCircle },
      monitor: { label: 'Surveiller', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700', icon: AlertTriangle },
      replace: { label: 'Remplacer', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700', icon: TrendingDown }
    }
    
    const { label, className, icon: Icon } = config[recommendation]
    return (
      <Badge className={`${className} border flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    )
  }

  const filteredAnalysis = analysis.filter(item => 
    item.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stats = {
    toReplace: analysis.filter(a => a.recommendation === 'replace').length,
    toMonitor: analysis.filter(a => a.recommendation === 'monitor').length,
    toKeep: analysis.filter(a => a.recommendation === 'keep').length,
    avgScore: analysis.reduce((sum, a) => sum + a.score, 0) / analysis.length
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analyse de Remplacement</h1>
          <p className="text-muted-foreground">
            Optimisez le renouvellement de votre flotte
          </p>
        </div>
        <ProtectedComponent resource="vehicles" action="create">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle analyse
          </Button>
        </ProtectedComponent>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <TrendingDown className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">À remplacer</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.toReplace}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">À surveiller</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.toMonitor}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">À conserver</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.toKeep}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Truck className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Score moyen</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.avgScore.toFixed(0)}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un véhicule..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-background text-foreground"
        />
      </div>

      {/* Analysis List */}
      <div className="grid gap-4">
        {filteredAnalysis.map((item) => (
          <Card key={item.id} className="card-hover">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-foreground">{item.vehiclePlate}</span>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <span className={`font-bold ${item.score > 70 ? 'text-green-600' : item.score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Âge</p>
                      <p className="font-semibold text-foreground">{item.age} ans</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kilométrage</p>
                      <p className="font-semibold text-foreground">{item.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Coût maintenance</p>
                      <p className="font-semibold text-foreground">{item.maintenanceCost.toLocaleString()} €</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Efficacité</p>
                      <p className="font-semibold text-foreground">{item.efficiency} km/L</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  {getRecommendationBadge(item.recommendation)}
                  <ProtectedComponent resource="vehicles" action="update">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Détails
                    </Button>
                  </ProtectedComponent>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 