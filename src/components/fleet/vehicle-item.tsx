'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListItem, CardItem } from '@/components/ui/view-toggle'
import { 
  Truck, 
  Calendar, 
  Gauge, 
  Fuel,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { ViewMode } from '@/components/ui/view-toggle'

import { UIVehicle } from '@/types'

// Utilisation du type UIVehicle pour la compatibilité
type Vehicle = UIVehicle

interface VehicleItemProps {
  vehicle: Vehicle
  viewMode: ViewMode
  onEdit?: (vehicle: Vehicle) => void
  onView?: (vehicle: Vehicle) => void
  className?: string
}

export function VehicleItem({ vehicle, viewMode, onEdit, onView, className = '' }: VehicleItemProps) {
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut: string) => {
    switch (statut?.toLowerCase()) {
      case 'disponible':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700'
      case 'en_mission':
      case 'en_route':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-700'
      case 'maintenance':
      case 'en_maintenance':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-200 dark:border-orange-700'
      case 'panne':
      case 'hors_service':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-200 dark:border-gray-700'
    }
  }

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (statut: string) => {
    switch (statut?.toLowerCase()) {
      case 'disponible':
        return <CheckCircle className="h-3 w-3" />
      case 'en_mission':
      case 'en_route':
        return <Truck className="h-3 w-3" />
      case 'maintenance':
      case 'en_maintenance':
        return <Clock className="h-3 w-3" />
      case 'panne':
      case 'hors_service':
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Truck className="h-3 w-3" />
    }
  }

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Affichage en mode liste
  if (viewMode === 'list') {
    return (
      <ListItem className={className} onClick={() => onView?.(vehicle)}>
        <div className="flex items-center gap-4 flex-1">
          {/* Icône et immatriculation */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{vehicle.immatriculation}</p>
              <p className="text-sm text-muted-foreground">{vehicle.modele}</p>
            </div>
          </div>

          {/* Statut */}
          <Badge className={`${getStatusColor(vehicle.statut)} border`}>
            {getStatusIcon(vehicle.statut)}
            <span className="ml-1 capitalize">
              {vehicle.statut?.replace('_', ' ') || 'Inconnu'}
            </span>
          </Badge>

          {/* Informations complémentaires */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {vehicle.capacite && (
              <div className="flex items-center gap-1">
                <Fuel className="h-4 w-4" />
                {vehicle.capacite.toLocaleString()}L
              </div>
            )}
            {vehicle.kilometrage && (
              <div className="flex items-center gap-1">
                <Gauge className="h-4 w-4" />
                {vehicle.kilometrage.toLocaleString()}km
              </div>
            )}
            {vehicle.prochaineMaintenance && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(vehicle.prochaineMaintenance)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onView?.(vehicle)
            }}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(vehicle)
            }}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </ListItem>
    )
  }

  // Affichage en mode carte
  return (
    <CardItem 
      className={className} 
      onClick={() => onView?.(vehicle)}
    >
      {/* Header de la carte */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{vehicle.immatriculation}</h3>
            <p className="text-sm text-muted-foreground">{vehicle.modele}</p>
          </div>
        </div>
        
        <Badge className={`${getStatusColor(vehicle.statut)} border`}>
          {getStatusIcon(vehicle.statut)}
          <span className="ml-1 capitalize">
            {vehicle.statut?.replace('_', ' ') || 'Inconnu'}
          </span>
        </Badge>
      </div>

      {/* Informations détaillées */}
      <div className="space-y-3 mb-4">
        {vehicle.capacite && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Fuel className="h-4 w-4" />
              Capacité
            </div>
            <span className="font-medium text-foreground">{vehicle.capacite.toLocaleString()}L</span>
          </div>
        )}
        
        {vehicle.kilometrage && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Gauge className="h-4 w-4" />
              Kilométrage
            </div>
            <span className="font-medium text-foreground">{vehicle.kilometrage.toLocaleString()}km</span>
          </div>
        )}
        
        {vehicle.prochaineMaintenance && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Prochaine maintenance
            </div>
            <span className="font-medium text-foreground">{formatDate(vehicle.prochaineMaintenance)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onView?.(vehicle)
          }}
          className="flex-1 hover:bg-muted"
        >
          <Eye className="h-4 w-4 mr-2" />
          Voir
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(vehicle)
          }}
          className="flex-1 hover:bg-muted"
        >
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>
    </CardItem>
  )
} 