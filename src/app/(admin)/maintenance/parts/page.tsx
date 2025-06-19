"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, AlertTriangle, TrendingDown, Truck, Plus, Search, Filter } from 'lucide-react'

interface SparePart {
  id: string
  name: string
  partNumber: string
  category: string
  description: string
  currentStock: number
  minThreshold: number
  maxThreshold: number
  unitPrice: number
  supplier: string
  location: string
  vehicleCompatibility: string[]
  lastRestocked: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'ordered'
}

const mockSpareParts: SparePart[] = [
  {
    id: '1',
    name: 'Filtre à huile moteur',
    partNumber: 'F-001-VOL',
    category: 'Filtration',
    description: 'Filtre à huile moteur Volvo D13',
    currentStock: 15,
    minThreshold: 5,
    maxThreshold: 25,
    unitPrice: 45.80,
    supplier: 'Volvo Parts',
    location: 'A1-B3',
    vehicleCompatibility: ['TC-001-FR', 'TC-004-FR'],
    lastRestocked: '2024-02-15',
    status: 'in_stock'
  },
  {
    id: '2',
    name: 'Plaquettes de frein avant',
    partNumber: 'B-003-MER',
    category: 'Freinage',
    description: 'Jeu de plaquettes frein avant Mercedes Actros',
    currentStock: 2,
    minThreshold: 4,
    maxThreshold: 12,
    unitPrice: 185.50,
    supplier: 'Mercedes Trucks',
    location: 'B2-C1',
    vehicleCompatibility: ['TC-002-FR'],
    lastRestocked: '2024-01-20',
    status: 'low_stock'
  },
  {
    id: '3',
    name: 'Flexible hydraulique',
    partNumber: 'H-012-DAF',
    category: 'Hydraulique',
    description: 'Flexible haute pression DAF XF',
    currentStock: 0,
    minThreshold: 2,
    maxThreshold: 8,
    unitPrice: 125.00,
    supplier: 'DAF Service',
    location: 'C1-A2',
    vehicleCompatibility: ['TC-003-FR'],
    lastRestocked: '2023-12-10',
    status: 'out_of_stock'
  },
  {
    id: '4',
    name: 'Amortisseur arrière',
    partNumber: 'S-008-VOL',
    category: 'Suspension',
    description: 'Amortisseur pneumatique arrière Volvo',
    currentStock: 8,
    minThreshold: 3,
    maxThreshold: 15,
    unitPrice: 320.00,
    supplier: 'Volvo Parts',
    location: 'D1-B4',
    vehicleCompatibility: ['TC-001-FR'],
    lastRestocked: '2024-03-01',
    status: 'in_stock'
  }
]

export default function SparePartsPage() {
  const [spareParts] = useState<SparePart[]>(mockSpareParts)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredParts = spareParts.filter(part => {
    const statusMatch = statusFilter === 'all' || part.status === statusFilter
    const categoryMatch = categoryFilter === 'all' || part.category === categoryFilter
    const searchMatch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       part.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    return statusMatch && categoryMatch && searchMatch
  })

  const getStatusBadge = (status: SparePart['status']) => {
    const statusConfig = {
      in_stock: { label: 'En stock', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      low_stock: { label: 'Stock faible', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
      out_of_stock: { label: 'Rupture', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
      ordered: { label: 'Commandé', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' }
    }
    
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100
    return Math.min(100, Math.max(0, percentage))
  }

  const partsStats = {
    total: spareParts.length,
    inStock: spareParts.filter(p => p.status === 'in_stock').length,
    lowStock: spareParts.filter(p => p.status === 'low_stock').length,
    outOfStock: spareParts.filter(p => p.status === 'out_of_stock').length,
    totalValue: spareParts.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0),
    categories: new Set(spareParts.map(p => p.category)).size
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pièces Détachées</h1>
          <p className="text-muted-foreground">
            Gérez votre stock de pièces détachées et consommables
          </p>
        </div>
        <div className="flex gap-3">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter pièce
          </Button>
          <Button variant="outline">
            Commander stock
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total pièces</p>
                <p className="text-2xl font-bold text-foreground">{partsStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">En stock</p>
                <p className="text-2xl font-bold text-foreground">{partsStats.inStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Stock faible</p>
                <p className="text-2xl font-bold text-foreground">{partsStats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Rupture</p>
                <p className="text-2xl font-bold text-foreground">{partsStats.outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span className="text-purple-600 font-bold">€</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Valeur stock</p>
                <p className="text-2xl font-bold text-foreground">{Math.round(partsStats.totalValue).toLocaleString()} €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-blue-600 font-bold">#</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Catégories</p>
                <p className="text-2xl font-bold text-foreground">{partsStats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une pièce..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Toutes catégories</option>
          <option value="Filtration">Filtration</option>
          <option value="Freinage">Freinage</option>
          <option value="Hydraulique">Hydraulique</option>
          <option value="Suspension">Suspension</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les statuts</option>
          <option value="in_stock">En stock</option>
          <option value="low_stock">Stock faible</option>
          <option value="out_of_stock">Rupture</option>
          <option value="ordered">Commandé</option>
        </select>
      </div>

      {/* Parts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredParts.map((part) => (
          <Card key={part.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg">{part.name}</CardTitle>
                  <Badge variant="outline">{part.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Réf: {part.partNumber} • {part.supplier}
                </p>
              </div>
              {getStatusBadge(part.status)}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground">{part.description}</p>

              {/* Stock Level */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Stock actuel</span>
                  <span className="font-medium">{part.currentStock} unités</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      part.status === 'out_of_stock' ? 'bg-red-500' :
                      part.status === 'low_stock' ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${getStockLevel(part.currentStock, part.minThreshold, part.maxThreshold)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {part.minThreshold}</span>
                  <span>Max: {part.maxThreshold}</span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Prix unitaire</p>
                  <p className="font-semibold text-lg">{part.unitPrice} €</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Emplacement</p>
                  <p className="font-medium">{part.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valeur stock</p>
                  <p className="font-medium">{(part.currentStock * part.unitPrice).toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dernier réappro</p>
                  <p className="font-medium">{new Date(part.lastRestocked).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Vehicle Compatibility */}
              <div>
                <p className="text-sm font-medium mb-2">Compatibilité véhicules</p>
                <div className="flex flex-wrap gap-1">
                  {part.vehicleCompatibility.map((vehicle, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Truck className="h-3 w-3 mr-1" />
                      {vehicle}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Alert */}
              {(part.status === 'low_stock' || part.status === 'out_of_stock') && (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  part.status === 'out_of_stock' 
                    ? 'bg-red-50 dark:bg-red-900/20' 
                    : 'bg-orange-50 dark:bg-orange-900/20'
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    part.status === 'out_of_stock' ? 'text-red-500' : 'text-orange-500'
                  }`} />
                  <span className={`text-sm ${
                    part.status === 'out_of_stock' 
                      ? 'text-red-700 dark:text-red-300' 
                      : 'text-orange-700 dark:text-orange-300'
                  }`}>
                    {part.status === 'out_of_stock' 
                      ? 'Rupture de stock - Commander immédiatement'
                      : 'Stock faible - Prévoir réapprovisionnement'
                    }
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  Voir historique
                </Button>
                <Button 
                  size="sm" 
                  className={`flex-1 ${
                    part.status === 'out_of_stock' ? 'bg-red-600 hover:bg-red-700' :
                    part.status === 'low_stock' ? 'bg-orange-600 hover:bg-orange-700' : ''
                  }`}
                >
                  {part.status === 'out_of_stock' || part.status === 'low_stock' 
                    ? 'Commander' 
                    : 'Gérer stock'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Stock Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Mouvements de stock récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '2024-03-15', part: 'Filtre à huile moteur', movement: 'Sortie', quantity: -2, reason: 'Maintenance TC-001-FR' },
              { date: '2024-03-14', part: 'Plaquettes de frein avant', movement: 'Sortie', quantity: -1, reason: 'Réparation TC-002-FR' },
              { date: '2024-03-01', part: 'Amortisseur arrière', movement: 'Entrée', quantity: +5, reason: 'Réapprovisionnement' }
            ].map((movement, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    movement.quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{movement.part}</p>
                    <p className="text-sm text-muted-foreground">{movement.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </p>
                  <p className="text-xs text-muted-foreground">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 