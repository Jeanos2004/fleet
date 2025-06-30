"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { Star, User, Calendar, Plus, Search } from 'lucide-react'

interface Review {
  id: string
  driverId: string
  driverName: string
  reviewDate: string
  overallRating: number
  safetyRating: number
  punctualityRating: number
  customerServiceRating: number
  comments: string
  reviewer: string
  status: 'pending' | 'completed' | 'overdue'
}

const mockReviews: Review[] = [
  {
    id: '1',
    driverId: 'd1',
    driverName: 'Pierre Martin',
    reviewDate: '2024-03-15',
    overallRating: 4.5,
    safetyRating: 5,
    punctualityRating: 4,
    customerServiceRating: 4.5,
    comments: 'Excellent conducteur, très professionnel',
    reviewer: 'Manager Transport',
    status: 'completed'
  },
  {
    id: '2',
    driverId: 'd2',
    driverName: 'Marie Dubois',
    reviewDate: '2024-03-20',
    overallRating: 0,
    safetyRating: 0,
    punctualityRating: 0,
    customerServiceRating: 0,
    comments: '',
    reviewer: 'Manager Transport',
    status: 'pending'
  }
]

export default function DriverReviewsPage() {
  const [reviews] = useState<Review[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadge = (status: Review['status']) => {
    const config = {
      pending: { label: 'En attente', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
      completed: { label: 'Terminée', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
      overdue: { label: 'En retard', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700' }
    }
    
    const { label, className } = config[status]
    return <Badge className={`${className} border`}>{label}</Badge>
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">
          {rating > 0 ? rating.toFixed(1) : 'N/A'}
        </span>
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => 
    review.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.reviewer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Évaluations Conducteurs</h1>
          <p className="text-muted-foreground">
            Suivez les performances de vos conducteurs
          </p>
        </div>
        <ProtectedComponent resource="drivers" action="create">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </ProtectedComponent>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher une évaluation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-background text-foreground"
        />
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="card-hover">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-foreground">{review.driverName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(review.reviewDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      par {review.reviewer}
                    </div>
                  </div>
                  
                  {review.status === 'completed' ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Note globale</p>
                          {renderStars(review.overallRating)}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Sécurité</p>
                          {renderStars(review.safetyRating)}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Ponctualité</p>
                          {renderStars(review.punctualityRating)}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Service client</p>
                          {renderStars(review.customerServiceRating)}
                        </div>
                      </div>
                      
                      {review.comments && (
                        <div className="bg-accent/50 rounded-lg p-3">
                          <p className="text-sm font-medium text-foreground mb-1">Commentaires</p>
                          <p className="text-sm text-muted-foreground">{review.comments}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Évaluation en attente de completion</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  {getStatusBadge(review.status)}
                  <ProtectedComponent resource="drivers" action="update">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      {review.status === 'pending' ? 'Compléter' : 'Modifier'}
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
