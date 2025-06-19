import { Button } from '@/components/ui/button'
import { ExportManager } from '@/components/reports/export-manager'
import { formatDate, formatCurrency } from '@/lib/utils'
import { FileText, Download, Eye, Calendar, TrendingUp, DollarSign, Clock, BarChart3 } from 'lucide-react'

// Données mockées pour les factures
const mockFactures = [
  {
    id: 'FACT-2024-001',
    marketeurId: '1',
    mois: 2,
    annee: 2024,
    missions: ['1', '2'],
    montantTotal: 1245.50,
    statut: 'PAYEE',
    dateEmission: new Date('2024-03-01'),
    datePaiement: new Date('2024-03-15')
  },
  {
    id: 'FACT-2024-002',
    marketeurId: '2',
    mois: 3,
    annee: 2024,
    missions: ['3'],
    montantTotal: 890.00,
    statut: 'EMISE',
    dateEmission: new Date('2024-03-01'),
    datePaiement: null
  },
  {
    id: 'FACT-2024-003',
    marketeurId: '3',
    mois: 2,
    annee: 2024,
    missions: ['4'],
    montantTotal: 567.25,
    statut: 'EN_RETARD',
    dateEmission: new Date('2024-02-01'),
    datePaiement: null
  }
]

// Données pour les rapports
const rapportsDisponibles = [
  {
    id: 'rapport-livraisons',
    nom: 'Rapport de livraisons',
    description: 'Détail des livraisons par période',
    type: 'PDF',
    derniereMiseAJour: new Date('2024-03-15'),
    taille: '2.3 MB'
  },
  {
    id: 'rapport-flotte',
    nom: 'État de la flotte',
    description: 'Disponibilité et maintenance',
    type: 'Excel',
    derniereMiseAJour: new Date('2024-03-14'),
    taille: '1.8 MB'
  },
  {
    id: 'rapport-couts',
    nom: 'Analyse des coûts',
    description: 'Coûts par mission et camion',
    type: 'PDF',
    derniereMiseAJour: new Date('2024-03-13'),
    taille: '1.5 MB'
  }
]

export default function ReportsPage() {
  const totalFactures = mockFactures.reduce((sum, f) => sum + f.montantTotal, 0)
  const facturesPayees = mockFactures.filter(f => f.statut === 'PAYEE').length
  const facturesEnRetard = mockFactures.filter(f => f.statut === 'EN_RETARD').length
  const delaiMoyenPaiement = 12 // jours

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Rapports & Facturation</h1>
              <p className="text-muted-foreground mt-2">
                Génération de rapports et gestion de la facturation mensuelle
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{formatCurrency(totalFactures)} ce mois</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2 input-styled">
                  <Calendar className="h-4 w-4" />
                  Période
                </Button>
                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                  <FileText className="h-4 w-4" />
                  Nouveau Rapport
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chiffre d&apos;affaires</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{formatCurrency(totalFactures)}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">+12% vs mois dernier</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Factures payées</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{facturesPayees}</span>
                    <span className="text-sm text-muted-foreground">/{mockFactures.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{Math.round((facturesPayees / mockFactures.length) * 100)}% du total</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                  <Clock className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En retard</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{facturesEnRetard}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Nécessitent relance</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Délai moyen</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{delaiMoyenPaiement}</span>
                    <span className="text-sm text-muted-foreground">j</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Délai de paiement</p>
          </div>
        </div>

        {/* Reports and Invoices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rapports disponibles */}
          <div className="card-hover rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rapports disponibles
              </h2>
              <Button variant="outline" size="sm">Générer</Button>
            </div>
            
            <div className="space-y-4">
              {rapportsDisponibles.map((rapport) => (
                <div key={rapport.id} className="gradient-border">
                  <div className="p-4 bg-card rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-card-foreground">{rapport.nom}</h3>
                            <p className="text-sm text-muted-foreground">{rapport.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="bg-muted/30 px-2 py-1 rounded">Type: {rapport.type}</div>
                          <div className="bg-muted/30 px-2 py-1 rounded">Taille: {rapport.taille}</div>
                          <div className="bg-muted/30 px-2 py-1 rounded">MAJ: {formatDate(rapport.derniereMiseAJour)}</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" className="input-styled flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Voir
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Manager */}
          <div className="card-hover rounded-xl p-6">
            <ExportManager />
          </div>
        </div>
      </div>
    </div>
  )
} 