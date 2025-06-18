import { Button } from '@/components/ui/button'
import { mockMissions, mockCamions, mockChauffeurs } from '@/lib/db/mock-data'
import { getStatusColor, formatDate, formatCurrency } from '@/lib/utils'
import { Plus, MapPin, Clock, Truck, Calendar } from 'lucide-react'

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Missions</h1>
              <p className="text-muted-foreground mt-2">
                Planification et suivi des livraisons de carburant
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>8 missions actives</span>
              </div>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Nouvelle Mission
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Missions actives</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">8</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">+2 depuis hier</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Terminées aujourd'hui</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">12</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">94% à temps</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Truck className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Distance totale</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">1,247</span>
                    <span className="text-sm text-muted-foreground">km</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Coût estimé</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">€2,456</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Missions en cours</p>
          </div>
        </div>

        {/* Missions List */}
        <div className="card-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-card-foreground">Missions récentes</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Filtrer</Button>
              <Button variant="outline" size="sm">Exporter</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {mockMissions.map((mission) => {
              const camion = mockCamions.find(c => c.id === mission.camionId)
              const chauffeur = mockChauffeurs.find(c => c.id === mission.chauffeurId)
              
              return (
                <div key={mission.id} className="gradient-border">
                  <div className="p-6 bg-card rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-card-foreground">Mission #{mission.id}</h3>
                            <p className="text-muted-foreground">
                              {mission.type === 'UNIQUE' ? 'Livraison unique' : 'Livraison multiple'} - {mission.sites.length} site(s)
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.statut)}`}>
                            {mission.statut.replace('_', ' ')}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Camion:</span>
                            <p className="font-medium text-card-foreground">{camion?.immatriculation}</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Chauffeur:</span>
                            <p className="font-medium text-card-foreground">{chauffeur?.nom} {chauffeur?.prenom}</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Distance:</span>
                            <p className="font-medium text-card-foreground">
                              {mission.distanceReelle ? 
                                `${mission.distanceReelle} km` : 
                                `${mission.distanceEstimee} km estimé`
                              }
                            </p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Coût:</span>
                            <p className="font-medium text-card-foreground">
                              {mission.fraisReels ? 
                                formatCurrency(mission.fraisReels.total) : 
                                formatCurrency(mission.fraisEstimes.total)
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Début: {formatDate(mission.dateDebut)}</span>
                          </div>
                          {mission.dateFin && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Fin: {formatDate(mission.dateFin)}</span>
                            </div>
                          )}
                          {mission.ecartDistance && (
                            <div className={`flex items-center gap-2 ${mission.ecartDistance > 10 ? 'text-red-500' : 'text-green-500'}`}>
                              <MapPin className="h-4 w-4" />
                              <span>Écart: {mission.ecartDistance.toFixed(1)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-6">
                        <Button variant="outline" size="sm" className="input-styled">
                          Détails
                        </Button>
                        {mission.statut === 'EN_COURS' && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Terminer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 