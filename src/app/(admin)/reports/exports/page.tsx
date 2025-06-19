"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, Calendar, Users, Truck, DollarSign, Clock, CheckCircle } from 'lucide-react'

interface ExportTemplate {
  id: string
  name: string
  description: string
  category: 'financial' | 'operational' | 'maintenance' | 'compliance'
  format: 'PDF' | 'Excel' | 'CSV'
  frequency: 'manual' | 'daily' | 'weekly' | 'monthly'
  lastGenerated?: string
  fileSize?: string
  status: 'available' | 'generating' | 'scheduled'
}

const mockExportTemplates: ExportTemplate[] = [
  {
    id: '1',
    name: 'Rapport financier mensuel',
    description: 'Analyse complète des revenus, dépenses et rentabilité',
    category: 'financial',
    format: 'PDF',
    frequency: 'monthly',
    lastGenerated: '2024-03-01',
    fileSize: '2.4 MB',
    status: 'available'
  },
  {
    id: '2',
    name: 'Performance opérationnelle',
    description: 'KPIs opérationnels, utilisation flotte, ponctualité',
    category: 'operational',
    format: 'Excel',
    frequency: 'weekly',
    lastGenerated: '2024-03-15',
    fileSize: '1.8 MB',
    status: 'available'
  },
  {
    id: '3',
    name: 'Historique maintenance',
    description: 'Détail des interventions et coûts de maintenance',
    category: 'maintenance',
    format: 'Excel',
    frequency: 'monthly',
    lastGenerated: '2024-02-28',
    fileSize: '3.2 MB',
    status: 'available'
  },
  {
    id: '4',
    name: 'Conformité réglementaire',
    description: 'Vérifications réglementaires et échéances',
    category: 'compliance',
    format: 'PDF',
    frequency: 'monthly',
    status: 'generating'
  },
  {
    id: '5',
    name: 'Rapport carburant détaillé',
    description: 'Consommation et efficacité par véhicule et chauffeur',
    category: 'operational',
    format: 'CSV',
    frequency: 'weekly',
    lastGenerated: '2024-03-14',
    fileSize: '890 KB',
    status: 'available'
  },
  {
    id: '6',
    name: 'Dashboard exécutif',
    description: 'Synthèse pour direction générale',
    category: 'financial',
    format: 'PDF',
    frequency: 'monthly',
    status: 'scheduled'
  }
]

export default function ExportsPage() {
  const [templates] = useState<ExportTemplate[]>(mockExportTemplates)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [formatFilter, setFormatFilter] = useState<string>('all')

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = categoryFilter === 'all' || template.category === categoryFilter
    const formatMatch = formatFilter === 'all' || template.format === formatFilter
    return categoryMatch && formatMatch
  })

  const getCategoryBadge = (category: ExportTemplate['category']) => {
    const categoryConfig = {
      financial: { label: 'Financier', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', icon: DollarSign },
      operational: { label: 'Opérationnel', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300', icon: Truck },
      maintenance: { label: 'Maintenance', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300', icon: Users },
      compliance: { label: 'Conformité', className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300', icon: CheckCircle }
    }
    
    const config = categoryConfig[category]
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: ExportTemplate['status']) => {
    const statusConfig = {
      available: { label: 'Disponible', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      generating: { label: 'Génération...', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
      scheduled: { label: 'Programmé', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' }
    }
    
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getFormatIcon = (format: ExportTemplate['format']) => {
    switch (format) {
      case 'PDF': return '📄'
      case 'Excel': return '📊'
      case 'CSV': return '📋'
      default: return '📁'
    }
  }

  const exportStats = {
    total: templates.length,
    available: templates.filter(t => t.status === 'available').length,
    scheduled: templates.filter(t => t.status === 'scheduled').length,
    categories: new Set(templates.map(t => t.category)).size
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exports et Rapports</h1>
          <p className="text-muted-foreground">
            Générez et téléchargez vos rapports personnalisés
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Nouveau modèle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total modèles</p>
                <p className="text-2xl font-bold text-foreground">{exportStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold text-foreground">{exportStats.available}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Programmés</p>
                <p className="text-2xl font-bold text-foreground">{exportStats.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 font-bold">#</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Catégories</p>
                <p className="text-2xl font-bold text-foreground">{exportStats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Toutes catégories</option>
          <option value="financial">Financier</option>
          <option value="operational">Opérationnel</option>
          <option value="maintenance">Maintenance</option>
          <option value="compliance">Conformité</option>
        </select>
        <select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous formats</option>
          <option value="PDF">PDF</option>
          <option value="Excel">Excel</option>
          <option value="CSV">CSV</option>
        </select>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2">
              <DollarSign className="h-6 w-6" />
              <span>Rapport financier</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Truck className="h-6 w-6" />
              <span>Performance flotte</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span>Planning maintenance</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getFormatIcon(template.format)}</span>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              <div className="flex flex-col gap-1">
                {getCategoryBadge(template.category)}
                {getStatusBadge(template.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Format</p>
                  <p className="font-medium">{template.format}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fréquence</p>
                  <p className="font-medium">
                    {template.frequency === 'manual' ? 'Manuel' :
                     template.frequency === 'daily' ? 'Quotidien' :
                     template.frequency === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                  </p>
                </div>
              </div>

              {/* Last Generated Info */}
              {template.lastGenerated && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center text-sm">
                    <span>Dernière génération</span>
                    <span className="font-medium">{new Date(template.lastGenerated).toLocaleDateString()}</span>
                  </div>
                  {template.fileSize && (
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span>Taille fichier</span>
                      <span className="font-medium">{template.fileSize}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Preview Content */}
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Contenu inclus:</p>
                <ul className="space-y-1">
                  {template.category === 'financial' && (
                    <>
                      <li>• Revenus et dépenses détaillés</li>
                      <li>• Analyse de rentabilité par véhicule</li>
                      <li>• Prévisions budgétaires</li>
                    </>
                  )}
                  {template.category === 'operational' && (
                    <>
                      <li>• Statistiques missions et livraisons</li>
                      <li>• Performances chauffeurs</li>
                      <li>• Utilisation véhicules</li>
                    </>
                  )}
                  {template.category === 'maintenance' && (
                    <>
                      <li>• Historique interventions</li>
                      <li>• Coûts maintenance par véhicule</li>
                      <li>• Planning préventif</li>
                    </>
                  )}
                  {template.category === 'compliance' && (
                    <>
                      <li>• Contrôles techniques</li>
                      <li>• Formations chauffeurs</li>
                      <li>• Assurances et permis</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t">
                {template.status === 'available' ? (
                  <>
                    <Button size="sm" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Télécharger
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Régénérer
                    </Button>
                  </>
                ) : template.status === 'generating' ? (
                  <Button size="sm" className="w-full" disabled>
                    Génération en cours...
                  </Button>
                ) : (
                  <Button size="sm" className="w-full">
                    Générer maintenant
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheduled Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Exports programmés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Rapport financier mensuel', nextRun: '2024-04-01 09:00', format: 'PDF' },
              { name: 'Performance opérationnelle', nextRun: '2024-03-22 08:00', format: 'Excel' },
              { name: 'Rapport carburant détaillé', nextRun: '2024-03-21 18:00', format: 'CSV' }
            ].map((scheduled, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div>
                    <p className="font-medium">{scheduled.name}</p>
                    <p className="text-sm text-muted-foreground">Format: {scheduled.format}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Prochaine exécution</p>
                  <p className="text-sm text-muted-foreground">{scheduled.nextRun}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Downloads */}
      <Card>
        <CardHeader>
          <CardTitle>Téléchargements récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { file: 'rapport-financier-mars-2024.pdf', date: '2024-03-15 14:30', size: '2.4 MB', user: 'Sophie Durand' },
              { file: 'performance-flotte-semaine-11.xlsx', date: '2024-03-15 09:15', size: '1.8 MB', user: 'Michel Bertrand' },
              { file: 'maintenance-historique-fevrier.xlsx', date: '2024-03-01 16:45', size: '3.2 MB', user: 'Sophie Durand' }
            ].map((download, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{download.file}</p>
                    <p className="text-xs text-muted-foreground">Par {download.user}</p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{download.size}</p>
                  <p className="text-muted-foreground">{download.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 