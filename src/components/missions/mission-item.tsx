'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListItem, CardItem } from '@/components/ui/view-toggle'
import { 
  MapPin, 
  Calendar, 
  Truck, 
  User,
  Clock,
  Route,
  Edit,
  Eye,
  CheckCircle,
  AlertTriangle,
  Play,
  Fuel
} from 'lucide-react'
import { ViewMode } from '@/components/ui/view-toggle'

interface Mission {
  id: string
  type: string
  statut: string
  camionId?: string
  chauffeurId?: string
  dateDebut: string | Date
  dateFin?: string | Date
  distance?: number
  quantite?: number
  destination: string
  client?: string
  urgente?: boolean
  // Propriétés additionnelles pour compatibilité avec missions/page.tsx
  title: string
  vehicleId: string
  vehiclePlate: string
  driverId: string
  driverName: string
  origin: string
  cargo: string
  priority: 'low' | 'medium' | 'high'
}

interface MissionItemProps {
  mission: Mission
  viewMode: ViewMode
  onEdit?: (mission: Mission) => void
  onView?: (mission: Mission) => void
  onStart?: (mission: Mission) => void
  className?: string
}

export function MissionItem({ mission, viewMode, onEdit, onView, onStart, className = '' }: MissionItemProps) {
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut: string) => {
    switch (statut?.toLowerCase()) {
      case 'planifiee':
      case 'planifiée':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'en_cours':
      case 'en_route':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
      case 'terminee':
      case 'terminée':
      case 'livree':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'annulee':
      case 'annulée':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      case 'suspendue':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    }
  }

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (statut: string) => {
    switch (statut?.toLowerCase()) {
      case 'planifiee':
      case 'planifiée':
        return <Calendar className="h-3 w-3" />
      case 'en_cours':
      case 'en_route':
        return <Truck className="h-3 w-3" />
      case 'terminee':
      case 'terminée':
      case 'livree':
        return <CheckCircle className="h-3 w-3" />
      case 'annulee':
      case 'annulée':
        return <AlertTriangle className="h-3 w-3" />
      case 'suspendue':
        return <Clock className="h-3 w-3" />
      default:
        return <MapPin className="h-3 w-3" />
    }
  }

  // Formater la date
  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('fr-FR')
  }

  // Formater l'heure
  const formatTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  // Obtenir le type de carburant
  const getFuelTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'essence':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'diesel':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'gaz':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  // Affichage en mode liste
  if (viewMode === 'list') {
    return (
      <ListItem className={className} onClick={() => onView?.(mission)}>
        <div className="flex items-center gap-4 flex-1">
          {/* Icône et ID mission */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Mission #{mission.id}</p>
              <p className="text-sm text-muted-foreground">
                {mission.destination || mission.client || 'Destination non spécifiée'}
              </p>
            </div>
          </div>

          {/* Badges de statut et type */}
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(mission.statut)} border`}>
              {getStatusIcon(mission.statut)}
              <span className="ml-1 capitalize">
                {mission.statut?.replace('_', ' ') || 'Inconnu'}
              </span>
            </Badge>
            
            {mission.urgente && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgent
              </Badge>
            )}
            
            {mission.type && (
              <Badge className={getFuelTypeColor(mission.type)}>
                <Fuel className="h-3 w-3 mr-1" />
                {mission.type}
              </Badge>
            )}
          </div>

          {/* Informations complémentaires */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(mission.dateDebut)} à {formatTime(mission.dateDebut)}
            </div>
            
            {mission.distance && (
              <div className="flex items-center gap-1">
                <Route className="h-4 w-4" />
                {mission.distance}km
              </div>
            )}
            
            {mission.quantite && (
              <div className="flex items-center gap-1">
                <Fuel className="h-4 w-4" />
                {mission.quantite.toLocaleString()}L
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {mission.statut?.toLowerCase() === 'planifiee' && (
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onStart?.(mission)
              }}
              className="h-8 px-3"
            >
              <Play className="h-4 w-4 mr-1" />
              Démarrer
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onView?.(mission)
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(mission)
            }}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </ListItem>
    )
  }

  // Affichage en mode carte ou grille
  const isCompact = viewMode === 'card'
  
  return (
    <CardItem 
      className={`${className} ${mission.urgente ? 'ring-2 ring-red-200 dark:ring-red-800' : ''}`}
      onClick={() => onView?.(mission)}

    >
      {/* Header de la carte */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Mission #{mission.id}</h3>
            {!isCompact && (
              <p className="text-sm text-muted-foreground">
                {mission.destination || mission.client || 'Destination non spécifiée'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(mission.statut)} border`}>
            {getStatusIcon(mission.statut)}
            {!isCompact && (
              <span className="ml-1 capitalize">
                {mission.statut?.replace('_', ' ') || 'Inconnu'}
              </span>
            )}
          </Badge>
        </div>
      </div>

      {/* Badges additionnels */}
      <div className="flex items-center gap-2 mb-4">
        {mission.urgente && (
          <Badge variant="destructive" className="animate-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {isCompact ? 'URG' : 'Urgent'}
          </Badge>
        )}
        
        {mission.type && (
          <Badge className={getFuelTypeColor(mission.type)}>
            <Fuel className="h-3 w-3 mr-1" />
            {mission.type}
          </Badge>
        )}
      </div>

      {/* Informations détaillées */}
      {!isCompact && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Début
            </div>
            <span className="font-medium">
              {formatDate(mission.dateDebut)} à {formatTime(mission.dateDebut)}
            </span>
          </div>
          
          {mission.distance && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Route className="h-4 w-4" />
                Distance
              </div>
              <span className="font-medium">{mission.distance}km</span>
            </div>
          )}
          
          {mission.quantite && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Fuel className="h-4 w-4" />
                Quantité
              </div>
              <span className="font-medium">{mission.quantite.toLocaleString()}L</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        {mission.statut?.toLowerCase() === 'planifiee' && (
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onStart?.(mission)
            }}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {isCompact ? '' : 'Démarrer'}
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onView?.(mission)
          }}
          className={mission.statut?.toLowerCase() === 'planifiee' ? 'flex-1' : 'flex-1'}
        >
          <Eye className="h-4 w-4 mr-2" />
          {isCompact ? '' : 'Voir'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(mission)
          }}
          className="flex-1"
        >
          <Edit className="h-4 w-4 mr-2" />
          {isCompact ? '' : 'Modifier'}
        </Button>
      </div>
    </CardItem>
  )
} 