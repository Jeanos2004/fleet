"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { Truck, Euro, TrendingUp, Wrench, Shield, Plus, Search, Download, Fuel } from 'lucide-react'

interface Expense {
  id: string
  vehicleId: string
  vehiclePlate: string
  category: 'fuel' | 'maintenance' | 'insurance' | 'repair' | 'other'
  amount: number
  date: string
  description: string
  vendor: string
  mileage: number
  status: 'paid' | 'pending' | 'approved'
  invoiceNumber?: string
}

const mockExpenses: Expense[] = [
  {
    id: '1',
    vehicleId: 'v1',
    vehiclePlate: 'TC-001-FR',
    category: 'fuel',
    amount: 142.50,
    date: '2024-03-16',
    description: 'Plein carburant',
    vendor: 'Total Energies',
    mileage: 125715,
    status: 'paid',
    invoiceNumber: 'FC-2024-001'
  },
  {
    id: '2',
    vehicleId: 'v2',
    vehiclePlate: 'TC-002-FR',
    category: 'maintenance',
    amount: 385.00,
    date: '2024-03-15',
    description: 'Vidange et filtres',
    vendor: 'Garage Mercier',
    mileage: 89450,
    status: 'approved',
    invoiceNumber: 'MT-2024-045'
  },
  {
    id: '3',
    vehicleId: 'v3',
    vehiclePlate: 'TC-003-FR',
    category: 'repair',
    amount: 1250.00,
    date: '2024-03-14',
    description: 'Réparation freins',
    vendor: 'Atelier Dubois',
    mileage: 157568,
    status: 'pending'
  }
]

export default function VehicleExpensesPage() {
  const { hasPermission } = useDemoAuth()
  const [expenses] = useState<Expense[]>(mockExpenses)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredExpenses = expenses.filter(expense => {
    const categoryMatch = categoryFilter === 'all' || expense.category === categoryFilter
    const searchMatch = expense.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       expense.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    return categoryMatch && searchMatch
  })

  const getCategoryBadge = (category: Expense['category']) => {
    const categoryConfig = {
      fuel: { label: 'Carburant', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700', icon: Fuel },
      maintenance: { label: 'Maintenance', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700', icon: Wrench },
      insurance: { label: 'Assurance', className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700', icon: Shield },
      repair: { label: 'Réparation', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700', icon: Wrench },
      other: { label: 'Autre', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700', icon: Euro }
    }
    
    const config = categoryConfig[category]
    const IconComponent = config.icon
    return (
      <Badge className={`${config.className} border flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getStatusBadge = (status: Expense['status']) => {
    const statusConfig = {
      paid: { label: 'Payé', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
      pending: { label: 'En attente', className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
      approved: { label: 'Approuvé', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' }
    }
    
    const config = statusConfig[status]
    return <Badge className={`${config.className} border`}>{config.label}</Badge>
  }

  const stats = {
    totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    fuelCosts: expenses.filter(e => e.category === 'fuel').reduce((sum, expense) => sum + expense.amount, 0),
    maintenanceCosts: expenses.filter(e => e.category === 'maintenance').reduce((sum, expense) => sum + expense.amount, 0),
    totalExpenses: expenses.length
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dépenses Véhicules</h1>
          <p className="text-muted-foreground">
            Suivez et analysez tous les coûts de votre flotte
          </p>
        </div>
        <div className="flex gap-2">
          <ProtectedComponent resource="vehicles" action="create">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle dépense
            </Button>
          </ProtectedComponent>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Euro className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total dépenses</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.totalAmount.toFixed(2)} €</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Fuel className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Carburant</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.fuelCosts.toFixed(2)} €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <Wrench className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Maintenance</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.maintenanceCosts.toFixed(2)} €</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              <div className="ml-3 md:ml-4">
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Nb dépenses</p>
                <p className="text-lg md:text-2xl font-bold text-foreground">{stats.totalExpenses}</p>
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
            placeholder="Rechercher une dépense..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background text-foreground"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={categoryFilter === 'all' ? 'default' : 'outline'} 
            onClick={() => setCategoryFilter('all')}
            size="sm"
          >
            Toutes
          </Button>
          <Button 
            variant={categoryFilter === 'fuel' ? 'default' : 'outline'} 
            onClick={() => setCategoryFilter('fuel')}
            size="sm"
          >
            Carburant
          </Button>
          <Button 
            variant={categoryFilter === 'maintenance' ? 'default' : 'outline'} 
            onClick={() => setCategoryFilter('maintenance')}
            size="sm"
          >
            Maintenance
          </Button>
          <Button 
            variant={categoryFilter === 'repair' ? 'default' : 'outline'} 
            onClick={() => setCategoryFilter('repair')}
            size="sm"
          >
            Réparations
          </Button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="grid gap-4">
        {filteredExpenses.map((expense) => (
          <Card key={expense.id} className="card-hover">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-foreground">{expense.vehiclePlate}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-medium text-foreground">{expense.description}</h3>
                    <div className="hidden sm:block text-muted-foreground">•</div>
                    <span className="text-sm text-muted-foreground">{expense.vendor}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Montant</p>
                      <p className="font-semibold text-foreground text-lg">{expense.amount.toFixed(2)} €</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kilométrage</p>
                      <p className="font-semibold text-foreground">{expense.mileage?.toLocaleString()} km</p>
                    </div>
                    {expense.invoiceNumber && (
                      <div>
                        <p className="text-muted-foreground">N° facture</p>
                        <p className="font-semibold text-foreground">{expense.invoiceNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  <div className="flex gap-2">
                    {getCategoryBadge(expense.category)}
                    {getStatusBadge(expense.status)}
                  </div>
                  <ProtectedComponent resource="vehicles" action="update">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Modifier
                    </Button>
                  </ProtectedComponent>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExpenses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Euro className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucune dépense trouvée</h3>
            <p className="text-muted-foreground">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche.'
                : 'Créez votre première dépense véhicule.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 

