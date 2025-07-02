"use client"

import { ViewToggle, useViewMode } from '@/components/ui/view-toggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Truck, User, Calendar, MapPin, Star } from 'lucide-react'

const mockData = [
  {
    id: '1',
    title: 'Véhicule TC-001-FR',
    subtitle: 'Mercedes Actros 2021',
    status: 'En mission',
    location: 'Paris, France',
    driver: 'Pierre Martin',
    rating: 4.8,
    details: 'Citerne 25000L - 87,542 km',
    lastUpdate: '2024-03-16'
  },
  {
    id: '2',
    title: 'Véhicule TC-002-FR',
    subtitle: 'Volvo FH16 2020',
    status: 'Disponible',
    location: 'Lyon, France',
    driver: 'Marie Dubois',
    rating: 4.6,
    details: 'Citerne 30000L - 142,300 km',
    lastUpdate: '2024-03-15'
  },
  {
    id: '3',
    title: 'Véhicule TC-003-FR',
    subtitle: 'Scania R450 2019',
    status: 'Maintenance',
    location: 'Atelier Central',
    driver: 'Jean Dupont',
    rating: 4.2,
    details: 'Citerne 28000L - 198,750 km',
    lastUpdate: '2024-03-14'
  },
  {
    id: '4',
    title: 'Véhicule EV-001-FR',
    subtitle: 'Tesla Semi 2023',
    status: 'Disponible',
    location: 'Marseille, France',
    driver: 'Sophie Laurent',
    rating: 4.9,
    details: 'Électrique 20000L - 15,800 km',
    lastUpdate: '2024-03-16'
  }
]

export default function TestViewTogglePage() {
  const { viewMode, setViewMode, isCardView, isListView } = useViewMode('card')

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'En mission': { className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      'Disponible': { className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      'Maintenance': { className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.className}>{status}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Test View Toggle</h1>
          <p className="text-muted-foreground">
            Démonstration du composant ViewToggle avec basculement entre vue carte et vue liste
          </p>
        </div>
        <ViewToggle 
          viewMode={viewMode} 
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Current Mode Indicator */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Mode actuel:</span>
            <Badge variant="outline">
              {viewMode === 'card' ? 'Vue en cartes' : 'Vue en liste'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      {isCardView ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockData.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Details */}
                <p className="text-sm text-muted-foreground">{item.details}</p>

                {/* Location and Driver */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{item.driver}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{item.rating}★</span>
                  </div>
                </div>

                {/* Last Update */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Mis à jour: {new Date(item.lastUpdate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Voir détails
                  </Button>
                  <Button size="sm" className="flex-1">
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Liste des Véhicules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-3 bg-muted/50 rounded-lg text-sm font-medium text-muted-foreground">
                <div className="col-span-3">Véhicule</div>
                <div className="col-span-2">Chauffeur</div>
                <div className="col-span-2">Localisation</div>
                <div className="col-span-2">Statut</div>
                <div className="col-span-2">Note</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {/* Table Rows */}
              {mockData.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  {/* Vehicle Info */}
                  <div className="col-span-12 md:col-span-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    <p className="text-xs text-muted-foreground">{item.details}</p>
                  </div>
                  
                  {/* Driver */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{item.driver}</span>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{item.location}</span>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-12 md:col-span-2">
                    {getStatusBadge(item.status)}
                  </div>
                  
                  {/* Rating */}
                  <div className="col-span-12 md:col-span-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-12 md:col-span-1">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        Voir
                      </Button>
                      <Button size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Panel */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Fonctionnalités du ViewToggle
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>• <strong>Vue Cartes:</strong> Affichage en grille avec cartes détaillées, idéal pour visualiser les informations complètes</li>
            <li>• <strong>Vue Liste:</strong> Affichage tabulaire compact, idéal pour comparer rapidement plusieurs éléments</li>
            <li>• <strong>Responsive:</strong> S'adapte automatiquement aux différentes tailles d'écran</li>
            <li>• <strong>Thème adaptatif:</strong> Support complet des modes clair et sombre</li>
            <li>• <strong>État persistant:</strong> Le choix de vue est mémorisé dans le composant</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
