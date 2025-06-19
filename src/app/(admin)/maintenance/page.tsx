import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockCamions } from '@/lib/db/mock-data'
import { getStatusColor, formatDate, formatCurrency } from '@/lib/utils'
import { Plus, Wrench, Clock, Calendar, Settings, Hammer } from 'lucide-react'

// Données mockées pour les ordres de travail
const mockWorkOrders = [
  {
    id: 'WO-001',
    camionId: '1',
    type: 'PREVENTIVE',
    statut: 'PLANIFIEE',
    description: 'Révision 10 000 km - Vidange, filtres, freins',
    technicienId: 'tech-1',
    dateCreation: new Date('2024-03-10'),
    dateDebut: new Date('2024-03-20'),
    dateFin: null,
    pieces: [
      { nom: 'Huile moteur', reference: 'OIL-001', quantite: 15, prixUnitaire: 8.50 },
      { nom: 'Filtre à huile', reference: 'FLT-001', quantite: 1, prixUnitaire: 25.00 },
      { nom: 'Plaquettes de frein', reference: 'BRK-001', quantite: 4, prixUnitaire: 85.00 }
    ],
    cout: 467.50,
    validee: false
  },
  {
    id: 'WO-002',
    camionId: '3',
    type: 'CURATIVE',
    statut: 'EN_COURS',
    description: 'Réparation système hydraulique - Fuite détectée',
    technicienId: 'tech-2',
    dateCreation: new Date('2024-03-15'),
    dateDebut: new Date('2024-03-16'),
    dateFin: null,
    pieces: [
      { nom: 'Joint hydraulique', reference: 'HYD-001', quantite: 2, prixUnitaire: 45.00 },
      { nom: 'Fluide hydraulique', reference: 'HYD-002', quantite: 5, prixUnitaire: 12.00 }
    ],
    cout: 150.00,
    validee: false
  },
  {
    id: 'WO-003',
    camionId: '2',
    type: 'PREVENTIVE',
    statut: 'TERMINEE',
    description: 'Contrôle technique annuel',
    technicienId: 'tech-1',
    dateCreation: new Date('2024-03-01'),
    dateDebut: new Date('2024-03-05'),
    dateFin: new Date('2024-03-05'),
    pieces: [],
    cout: 120.00,
    validee: true
  }
]

const mockTechniciens = [
  { id: 'tech-1', nom: 'Michel', prenom: 'Laurent', specialite: 'Mécanique générale' },
  { id: 'tech-2', nom: 'Dubois', prenom: 'Sophie', specialite: 'Hydraulique' }
]

export default function MaintenancePage() {
  const workOrdersEnCours = mockWorkOrders.filter(wo => wo.statut === 'EN_COURS').length
  const workOrdersPlanifiees = mockWorkOrders.filter(wo => wo.statut === 'PLANIFIEE').length
  const coutTotal = mockWorkOrders.reduce((total, wo) => total + wo.cout, 0)
  const mtbf = 2450 // Mean Time Between Failures en heures
  const mttr = 4.2 // Mean Time To Repair en heures

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Maintenance</h1>
              <p className="text-muted-foreground mt-2">
                Gestion de la maintenance préventive et curative des camions-citernes
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>{workOrdersEnCours} ordres en cours</span>
              </div>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Nouvel Ordre de Travail
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Wrench className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ordres en cours</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{workOrdersEnCours}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{workOrdersPlanifiees} planifiés</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">MTBF</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{mtbf}</span>
                    <span className="text-sm text-muted-foreground">h</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Temps moyen entre pannes</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Hammer className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">MTTR</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{mttr}</span>
                    <span className="text-sm text-muted-foreground">h</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Temps moyen de réparation</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Coût total</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{formatCurrency(coutTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </div>
        </div>

        {/* Work Orders List */}
        <div className="card-hover rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ordres de travail
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">Filtrer</Button>
              <Button variant="outline" size="sm">Exporter</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {mockWorkOrders.map((workOrder) => {
              const camion = mockCamions.find(c => c.id === workOrder.camionId)
              const technicien = mockTechniciens.find(t => t.id === workOrder.technicienId)
              
              return (
                <div key={workOrder.id} className="gradient-border">
                  <div className="p-6 bg-card rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Wrench className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-card-foreground">{workOrder.id}</h3>
                            <p className="text-muted-foreground">{workOrder.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant={workOrder.type === 'PREVENTIVE' ? 'default' : 'destructive'}>
                              {workOrder.type === 'PREVENTIVE' ? 'Préventive' : 'Curative'}
                            </Badge>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder.statut)}`}>
                              {workOrder.statut.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Camion</span>
                            <p className="font-medium text-card-foreground">{camion?.immatriculation}</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Technicien</span>
                            <p className="font-medium text-card-foreground">{technicien?.prenom} {technicien?.nom}</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Coût estimé</span>
                            <p className="font-medium text-card-foreground">{formatCurrency(workOrder.cout)}</p>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-lg">
                            <span className="text-muted-foreground block mb-1">Échéance</span>
                            <p className="font-medium text-card-foreground">
                              {workOrder.dateDebut ? formatDate(workOrder.dateDebut) : 'À planifier'}
                            </p>
                          </div>
                        </div>

                        {/* Pièces */}
                        {workOrder.pieces.length > 0 && (
                          <div className="bg-muted/20 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-card-foreground mb-3 flex items-center gap-2">
                              <Hammer className="h-4 w-4" />
                              Pièces nécessaires
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {workOrder.pieces.map((piece, index) => (
                                <div key={index} className="bg-card p-2 rounded border border-border">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-xs font-medium text-card-foreground">{piece.nom}</p>
                                      <p className="text-xs text-muted-foreground">{piece.reference}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs font-medium text-card-foreground">
                                        {piece.quantite} × {formatCurrency(piece.prixUnitaire)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        = {formatCurrency(piece.quantite * piece.prixUnitaire)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-6">
                        <Button variant="outline" size="sm" className="input-styled">
                          Détails
                        </Button>
                        {workOrder.statut === 'PLANIFIEE' && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Démarrer
                          </Button>
                        )}
                        {workOrder.statut === 'EN_COURS' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
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
