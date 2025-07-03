'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListItem, CardItem } from '@/components/ui/view-toggle'
import { 
  User, 
  Phone, 
  Calendar, 
  Star,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Car
} from 'lucide-react'
import { ViewMode } from '@/components/ui/view-toggle'

import { UIDriver } from '@/types'

// Utilisation du type UIDriver pour la compatibilité
type Driver = UIDriver

interface DriverItemProps {
  driver: Driver
  viewMode: ViewMode
  onEdit?: (driver: Driver) => void
  onView?: (driver: Driver) => void
  className?: string
}

export function DriverItem({ driver, viewMode, onEdit, onView, className = '' }: DriverItemProps) {
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut: string) => {
    switch (statut?.toLowerCase()) {
      case 'disponible':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
      case 'en_mission':
      case 'en_route':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
      case 'repos':
      case 'conge':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
      case 'absent':
      case 'maladie':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
    }
  }

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (statut: string) => {
    switch (statut?.toLowerCase()) {
      case 'disponible':
        return <CheckCircle className="h-3 w-3" />
      case 'en_mission':
      case 'en_route':
        return <Car className="h-3 w-3" />
      case 'repos':
      case 'conge':
        return <Clock className="h-3 w-3" />
      case 'absent':
      case 'maladie':
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  // Formater la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Générer les étoiles pour le rating
  const renderStars = (rating: number = 5) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ))
  }

  // Affichage en mode liste
  if (viewMode === 'list') {
    return (
      <ListItem className={className} onClick={() => onView?.(driver)}>
        <div className="flex items-center gap-4 flex-1">
          {/* Avatar et nom */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {driver.prenom} {driver.nom}
              </p>
              <p className="text-sm text-muted-foreground">{driver.email}</p>
            </div>
          </div>

          {/* Statut */}
          <Badge className={`${getStatusColor(driver.statut)} border`}>
            {getStatusIcon(driver.statut)}
            <span className="ml-1 capitalize">
              {driver.statut?.replace('_', ' ') || 'Inconnu'}
            </span>
          </Badge>

          {/* Informations complémentaires */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            {driver.telephone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {driver.telephone}
              </div>
            )}
            {driver.rating && (
              <div className="flex items-center gap-1">
                {renderStars(driver.rating)}
                <span className="ml-1">{driver.rating}/5</span>
              </div>
            )}
            {driver.totalMissions && (
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                {driver.totalMissions} missions
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
              onView?.(driver)
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
              onEdit?.(driver)
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
      className={className} 
      onClick={() => onView?.(driver)}

    >
      {/* Header de la carte */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {driver.prenom} {driver.nom}
            </h3>
            {!isCompact && (
              <p className="text-sm text-muted-foreground">{driver.email}</p>
            )}
          </div>
        </div>
        
        <Badge className={`${getStatusColor(driver.statut)} border`}>
          {getStatusIcon(driver.statut)}
          {!isCompact && (
            <span className="ml-1 capitalize">
              {driver.statut?.replace('_', ' ') || 'Inconnu'}
            </span>
          )}
        </Badge>
      </div>

      {/* Informations détaillées */}
      {!isCompact && (
        <div className="space-y-3 mb-4">
          {driver.telephone && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                Téléphone
              </div>
              <span className="font-medium">{driver.telephone}</span>
            </div>
          )}
          
          {driver.rating && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-4 w-4" />
                Évaluation
              </div>
              <div className="flex items-center gap-1">
                {renderStars(driver.rating)}
                <span className="font-medium ml-1">{driver.rating}/5</span>
              </div>
            </div>
          )}
          
          {driver.dateEmbauche && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Embauche
              </div>
              <span className="font-medium">{formatDate(driver.dateEmbauche)}</span>
            </div>
          )}

          {driver.totalMissions && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Car className="h-4 w-4" />
                Missions
              </div>
              <span className="font-medium">{driver.totalMissions}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onView?.(driver)
          }}
          className="flex-1"
        >
          <Eye className="h-4 w-4 mr-2" />
          {isCompact ? '' : 'Voir'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(driver)
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