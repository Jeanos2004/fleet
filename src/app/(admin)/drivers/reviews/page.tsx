"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRolePermissions, ProtectedComponent } from '@/hooks/use-role-permissions'
import { Star, TrendingUp, User, Calendar, Plus, Eye, Filter } from 'lucide-react'

interface DriverReview {
  id: string
  driverId: string
  driverName: string
  period: string
  overallRating: number
  safetyScore: number
  punctualityScore: number
  fuelEfficiencyScore: number
  customerSatisfaction: number
  reviewDate: string
  reviewer: string
  comments: string
  improvements: string[]
  achievements: string[]
  status: 'draft' | 'completed' | 'pending_signature'
}

const mockReviews: DriverReview[] = [
  {
    id: '1',
    driverId: 'd1',
    driverName: 'Pierre Martin',
    period: 'Q1 2024',
    overallRating: 4.2,
    safetyScore: 4.5,
    punctualityScore: 4.0,
    fuelEfficiencyScore: 3.8,
    customerSatisfaction: 4.3,
    reviewDate: '2024-03-15',
    reviewer: 'Sophie Durand',
    comments: 'Excellente performance globale. Conduite prudente et respect des délais.',
    improvements: ['Optimisation consommation carburant', 'Formation éco-conduite'],
    achievements: ['Aucun accident', '98% ponctualité', 'Feedback client positif'],
    status: 'completed'
  },
  {
    id: '2',
    driverId: 'd2',
    driverName: 'Marie Dubois',
    period: 'Q1 2024',
    overallRating: 4.6,
    safetyScore: 5.0,
    punctualityScore: 4.8,
    fuelEfficiencyScore: 4.2,
    customerSatisfaction: 4.5,
    reviewDate: '2024-03-10',
    reviewer: 'Michel Bertrand',
    comments: 'Performance exceptionnelle. Référence en matière de sécurité.',
    improvements: [],
    achievements: ['Conduite exemplaire', 'Formation nouvelle équipe', 'Économies carburant'],
    status: 'pending_signature'
  },
  {
    id: '3',
    driverId: 'd3',
    driverName: 'Jean Dupont',
    period: 'Q1 2024',
    overallRating: 3.4,
    safetyScore: 3.2,
    punctualityScore: 3.8,
    fuelEfficiencyScore: 3.1,
    customerSatisfaction: 3.5,
    reviewDate: '2024-03-12',
    reviewer: 'Sophie Durand',
    comments: 'Performance correcte mais des améliorations nécessaires.',
    improvements: ['Formation sécurité', 'Gestion du temps', 'Éco-conduite'],
    achievements: ['Amélioration ponctualité'],
    status: 'draft'
  }
]

export default function DriverReviewsPage() {
  const { hasPermission } = useRolePermissions()
  const [reviews] = useState<DriverReview[]>(mockReviews)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedDriver, setSelectedDriver] = useState<string>('all')

  const filteredReviews = reviews.filter(review => {
    const statusMatch = statusFilter === 'all' || review.status === statusFilter
    const driverMatch = selectedDriver === 'all' || review.driverId === selectedDriver
    return statusMatch && driverMatch
  })

  const getStatusBadge = (status: DriverReview['status']) => {
    const statusConfig = {
      draft: { label: 'Brouillon', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300' },
      completed: { label: 'Terminée', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      pending_signature: { label: 'En attente signature', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' }
    }
    
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const reviewStats = {
    total: reviews.length,
    completed: reviews.filter(r => r.status === 'completed').length,
    pending: reviews.filter(r => r.status === 'pending_signature').length,
    avgRating: reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
  }

  const drivers = Array.from(new Set(reviews.map(r => ({ id: r.driverId, name: r.driverName }))))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Évaluations Chauffeurs</h1>
          <p className="text-muted-foreground">
            Gérez les évaluations de performance de vos chauffeurs
          </p>
        </div>
        <ProtectedComponent resource="drivers" action="update">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </ProtectedComponent>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les chauffeurs</option>
          {drivers.map(driver => (
            <option key={driver.id} value={driver.id}>{driver.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les statuts</option>
          <option value="draft">Brouillons</option>
          <option value="pending_signature">En attente signature</option>
          <option value="completed">Terminées</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total évaluations</p>
                <p className="text-2xl font-bold text-foreground">{reviewStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Terminées</p>
                <p className="text-2xl font-bold text-foreground">{reviewStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-foreground">{reviewStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Note moyenne</p>
                <p className="text-2xl font-bold text-foreground">{reviewStats.avgRating.toFixed(1)}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg">{review.driverName}</CardTitle>
                  <Badge variant="outline">{review.period}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {getStarRating(review.overallRating)}
                  <span className="text-sm text-muted-foreground ml-1">
                    {review.overallRating.toFixed(1)}/5
                  </span>
                </div>
              </div>
              {getStatusBadge(review.status)}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Sécurité</p>
                  <div className="flex items-center gap-1">
                    {getStarRating(review.safetyScore)}
                    <span className="ml-1 font-medium">{review.safetyScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Ponctualité</p>
                  <div className="flex items-center gap-1">
                    {getStarRating(review.punctualityScore)}
                    <span className="ml-1 font-medium">{review.punctualityScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Efficacité carburant</p>
                  <div className="flex items-center gap-1">
                    {getStarRating(review.fuelEfficiencyScore)}
                    <span className="ml-1 font-medium">{review.fuelEfficiencyScore}</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Satisfaction client</p>
                  <div className="flex items-center gap-1">
                    {getStarRating(review.customerSatisfaction)}
                    <span className="ml-1 font-medium">{review.customerSatisfaction}</span>
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-1">Commentaires</p>
                <p className="text-sm text-muted-foreground">{review.comments}</p>
              </div>

              {/* Achievements */}
              {review.achievements.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-green-600">Réussites</p>
                  <div className="flex flex-wrap gap-1">
                    {review.achievements.map((achievement, index) => (
                      <Badge key={index} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {review.improvements.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-orange-600">Axes d&apos;amélioration</p>
                  <div className="flex flex-wrap gap-1">
                    {review.improvements.map((improvement, index) => (
                      <Badge key={index} variant="outline" className="text-orange-600 border-orange-300">
                        {improvement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Info */}
              <div className="text-xs text-muted-foreground pt-3 border-t">
                <p>Évalué par: {review.reviewer}</p>
                <p>Date: {new Date(review.reviewDate).toLocaleDateString()}</p>
              </div>

              {/* Actions */}
              <ProtectedComponent resource="drivers" action="update">
                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Voir détails
                  </Button>
                  {review.status === 'draft' && (
                    <Button size="sm" className="flex-1">
                      Finaliser
                    </Button>
                  )}
                  {review.status === 'pending_signature' && (
                    <Button size="sm" className="flex-1">
                      Envoyer signature
                    </Button>
                  )}
                </div>
              </ProtectedComponent>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 