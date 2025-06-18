"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { mockCamions, mockChauffeurs, mockSites } from '@/lib/db/mock-data'
import { calculateMissionCosts, calculateDistance } from '@/lib/utils'
import { Plus, Minus, MapPin, Calculator } from 'lucide-react'

interface MissionFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function MissionForm({ onSubmit, onCancel }: MissionFormProps) {
  const [formData, setFormData] = useState({
    camionId: '',
    chauffeurId: '',
    dateDebut: '',
    sites: [{ siteId: '', quantiteLivree: 0 }],
    distanceEstimee: 0,
    fraisEstimes: { carburant: 0, peages: 0, primes: 50, total: 50 }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const availableCamions = mockCamions.filter(c => c.disponible)
  const availableChauffeurs = mockChauffeurs.filter(c => c.disponible)

  const addSite = () => {
    setFormData(prev => ({
      ...prev,
      sites: [...prev.sites, { siteId: '', quantiteLivree: 0 }]
    }))
  }

  const removeSite = (index: number) => {
    if (formData.sites.length > 1) {
      setFormData(prev => ({
        ...prev,
        sites: prev.sites.filter((_, i) => i !== index)
      }))
    }
  }

  const updateSite = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sites: prev.sites.map((site, i) => 
        i === index ? { ...site, [field]: value } : site
      )
    }))
  }

  const calculateEstimatedDistance = () => {
    if (formData.sites.length === 0 || !formData.sites[0].siteId) return

    // Coordonnées du dépôt (simulées)
    const depotLat = 48.8566
    const depotLon = 2.3522
    
    let totalDistance = 0
    let currentLat = depotLat
    let currentLon = depotLon

    // Calculer la distance pour chaque site
    formData.sites.forEach(siteData => {
      const site = mockSites.find(s => s.id === siteData.siteId)
      if (site) {
        const distance = calculateDistance(currentLat, currentLon, site.latitude, site.longitude)
        totalDistance += distance
        currentLat = site.latitude
        currentLon = site.longitude
      }
    })

    // Retour au dépôt
    totalDistance += calculateDistance(currentLat, currentLon, depotLat, depotLon)

    const costs = calculateMissionCosts(totalDistance)
    
    setFormData(prev => ({
      ...prev,
      distanceEstimee: Math.round(totalDistance * 10) / 10,
      fraisEstimes: costs
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.camionId) newErrors.camionId = 'Sélectionnez un camion'
    if (!formData.chauffeurId) newErrors.chauffeurId = 'Sélectionnez un chauffeur'
    if (!formData.dateDebut) newErrors.dateDebut = 'Sélectionnez une date de début'
    
    formData.sites.forEach((site, index) => {
      if (!site.siteId) newErrors[`site-${index}`] = 'Sélectionnez un site'
      if (!site.quantiteLivree || site.quantiteLivree <= 0) {
        newErrors[`quantity-${index}`] = 'Quantité invalide'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const selectedCamion = mockCamions.find(c => c.id === formData.camionId)
  const totalQuantity = formData.sites.reduce((sum, site) => sum + site.quantiteLivree, 0)
  const capacityExceeded = selectedCamion && totalQuantity > selectedCamion.capaciteCiterne

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Nouvelle Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection camion et chauffeur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Camion *
              </label>
              <select
                value={formData.camionId}
                onChange={(e) => setFormData(prev => ({ ...prev, camionId: e.target.value }))}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Sélectionnez un camion</option>
                {availableCamions.map(camion => (
                  <option key={camion.id} value={camion.id}>
                    {camion.immatriculation} - {camion.marque} {camion.modele} ({camion.capaciteCiterne.toLocaleString()}L)
                  </option>
                ))}
              </select>
              {errors.camionId && <p className="text-red-500 text-sm mt-1">{errors.camionId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Chauffeur *
              </label>
              <select
                value={formData.chauffeurId}
                onChange={(e) => setFormData(prev => ({ ...prev, chauffeurId: e.target.value }))}
                className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Sélectionnez un chauffeur</option>
                {availableChauffeurs.map(chauffeur => (
                  <option key={chauffeur.id} value={chauffeur.id}>
                    {chauffeur.prenom} {chauffeur.nom}
                  </option>
                ))}
              </select>
              {errors.chauffeurId && <p className="text-red-500 text-sm mt-1">{errors.chauffeurId}</p>}
            </div>
          </div>

          {/* Date de début */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date et heure de début *
            </label>
            <input
              type="datetime-local"
              value={formData.dateDebut}
              onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
              className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.dateDebut && <p className="text-red-500 text-sm mt-1">{errors.dateDebut}</p>}
          </div>

          {/* Sites de livraison */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-foreground">
                Sites de livraison *
              </label>
              <Button type="button" onClick={addSite} size="sm" className="flex items-center gap-1">
                <Plus className="h-3 w-3" />
                Ajouter un site
              </Button>
            </div>

            <div className="space-y-4">
              {formData.sites.map((site, index) => (
                <div key={index} className="p-4 border border-border rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">Site {index + 1}</h4>
                    {formData.sites.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeSite(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Site
                      </label>
                      <select
                        value={site.siteId}
                        onChange={(e) => updateSite(index, 'siteId', e.target.value)}
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Sélectionnez un site</option>
                        {mockSites.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.nom} - {s.adresse}
                          </option>
                        ))}
                      </select>
                      {errors[`site-${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`site-${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Quantité (L)
                      </label>
                      <input
                        type="number"
                        value={site.quantiteLivree}
                        onChange={(e) => updateSite(index, 'quantiteLivree', parseInt(e.target.value) || 0)}
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        min="1"
                        step="1"
                      />
                      {errors[`quantity-${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`quantity-${index}`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vérification capacité */}
            {selectedCamion && (
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800 dark:text-blue-200">
                    Capacité utilisée: {totalQuantity.toLocaleString()}L / {selectedCamion.capaciteCiterne.toLocaleString()}L
                  </span>
                  <Badge variant={capacityExceeded ? 'destructive' : 'default'}>
                    {Math.round((totalQuantity / selectedCamion.capaciteCiterne) * 100)}%
                  </Badge>
                </div>
                {capacityExceeded && (
                  <p className="text-red-600 text-sm mt-2">
                    ⚠️ La quantité totale dépasse la capacité du camion
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Calcul automatique */}
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">Estimation des coûts</h3>
              <Button
                type="button"
                onClick={calculateEstimatedDistance}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                <Calculator className="h-3 w-3" />
                Calculer
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Distance:</span>
                <p className="font-medium text-foreground">{formData.distanceEstimee} km</p>
              </div>
              <div>
                <span className="text-muted-foreground">Carburant:</span>
                <p className="font-medium text-foreground">{formData.fraisEstimes.carburant.toFixed(2)}€</p>
              </div>
              <div>
                <span className="text-muted-foreground">Péages:</span>
                <p className="font-medium text-foreground">{formData.fraisEstimes.peages.toFixed(2)}€</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total:</span>
                <p className="font-medium text-foreground">{formData.fraisEstimes.total.toFixed(2)}€</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={capacityExceeded}>
              Créer la mission
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 