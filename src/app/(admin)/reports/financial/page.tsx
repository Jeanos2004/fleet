"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, TrendingDown, BarChart3, PieChart, Download, Calendar } from 'lucide-react'

interface FinancialData {
  period: string
  totalRevenue: number
  totalExpenses: number
  profit: number
  fuelCosts: number
  maintenanceCosts: number
  insuranceCosts: number
  salariesCosts: number
  vehicleCount: number
  avgRevenuePerVehicle: number
}

const mockFinancialData: FinancialData[] = [
  {
    period: 'Mars 2024',
    totalRevenue: 185000,
    totalExpenses: 142000,
    profit: 43000,
    fuelCosts: 65000,
    maintenanceCosts: 28000,
    insuranceCosts: 15000,
    salariesCosts: 34000,
    vehicleCount: 8,
    avgRevenuePerVehicle: 23125
  },
  {
    period: 'Février 2024',
    totalRevenue: 168000,
    totalExpenses: 135000,
    profit: 33000,
    fuelCosts: 58000,
    maintenanceCosts: 32000,
    insuranceCosts: 15000,
    salariesCosts: 30000,
    vehicleCount: 8,
    avgRevenuePerVehicle: 21000
  },
  {
    period: 'Janvier 2024',
    totalRevenue: 172000,
    totalExpenses: 128000,
    profit: 44000,
    fuelCosts: 55000,
    maintenanceCosts: 25000,
    insuranceCosts: 15000,
    salariesCosts: 33000,
    vehicleCount: 8,
    avgRevenuePerVehicle: 21500
  }
]

export default function FinancialReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Mars 2024')
  const [viewMode, setViewMode] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly')

  const currentData = mockFinancialData.find(data => data.period === selectedPeriod) || mockFinancialData[0]
  const previousData = mockFinancialData[1] // Février pour comparaison

  const calculateGrowth = (current: number, previous: number) => {
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const profitMargin = ((currentData.profit / currentData.totalRevenue) * 100).toFixed(1)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rapports Financiers</h1>
          <p className="text-muted-foreground">
            Analysez les performances financières de votre flotte
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            {mockFinancialData.map(data => (
              <option key={data.period} value={data.period}>{data.period}</option>
            ))}
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'monthly' ? 'default' : 'outline'}
          onClick={() => setViewMode('monthly')}
          size="sm"
        >
          Mensuel
        </Button>
        <Button
          variant={viewMode === 'quarterly' ? 'default' : 'outline'}
          onClick={() => setViewMode('quarterly')}
          size="sm"
        >
          Trimestriel
        </Button>
        <Button
          variant={viewMode === 'yearly' ? 'default' : 'outline'}
          onClick={() => setViewMode('yearly')}
          size="sm"
        >
          Annuel
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chiffre d&apos;affaires</p>
                <p className="text-2xl font-bold text-foreground">{currentData.totalRevenue.toLocaleString()} €</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{calculateGrowth(currentData.totalRevenue, previousData.totalRevenue)}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dépenses totales</p>
                <p className="text-2xl font-bold text-foreground">{currentData.totalExpenses.toLocaleString()} €</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-red-600 mr-1" />
                  <span className="text-sm text-red-600">
                    +{calculateGrowth(currentData.totalExpenses, previousData.totalExpenses)}%
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bénéfice net</p>
                <p className="text-2xl font-bold text-foreground">{currentData.profit.toLocaleString()} €</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">
                    +{calculateGrowth(currentData.profit, previousData.profit)}%
                  </span>
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Marge bénéficiaire</p>
                <p className="text-2xl font-bold text-foreground">{profitMargin}%</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">
                    {(parseFloat(profitMargin) - 19.6).toFixed(1)}% vs mois précédent
                  </span>
                </div>
              </div>
              <PieChart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Expenses Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution Revenus vs Dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Graphique en barres - Revenus vs Dépenses</p>
              <p className="text-sm">Intégration Chart.js/Recharts</p>
              <div className="mt-4 space-y-2">
                {mockFinancialData.map((data, index) => (
                  <div key={index} className="flex justify-between items-center max-w-md mx-auto">
                    <span className="text-sm">{data.period}</span>
                    <div className="flex gap-4">
                      <span className="text-green-600 font-medium">{data.totalRevenue.toLocaleString()}€</span>
                      <span className="text-red-600 font-medium">{data.totalExpenses.toLocaleString()}€</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Carburant</span>
                <span className="text-sm font-bold">{currentData.fuelCosts.toLocaleString()} € ({((currentData.fuelCosts / currentData.totalExpenses) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(currentData.fuelCosts / currentData.totalExpenses) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Salaires</span>
                <span className="text-sm font-bold">{currentData.salariesCosts.toLocaleString()} € ({((currentData.salariesCosts / currentData.totalExpenses) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(currentData.salariesCosts / currentData.totalExpenses) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maintenance</span>
                <span className="text-sm font-bold">{currentData.maintenanceCosts.toLocaleString()} € ({((currentData.maintenanceCosts / currentData.totalExpenses) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${(currentData.maintenanceCosts / currentData.totalExpenses) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assurances</span>
                <span className="text-sm font-bold">{currentData.insuranceCosts.toLocaleString()} € ({((currentData.insuranceCosts / currentData.totalExpenses) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(currentData.insuranceCosts / currentData.totalExpenses) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance par véhicule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="text-sm font-medium">Revenus moyens/véhicule</p>
                  <p className="text-2xl font-bold text-green-600">{currentData.avgRevenuePerVehicle.toLocaleString()} €</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">vs mois précédent</p>
                  <p className="text-sm font-medium text-green-600">
                    +{calculateGrowth(currentData.avgRevenuePerVehicle, previousData.avgRevenuePerVehicle)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Coût carburant/véhicule</p>
                  <p className="font-bold">{Math.round(currentData.fuelCosts / currentData.vehicleCount).toLocaleString()} €</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">Coût maintenance/véhicule</p>
                  <p className="font-bold">{Math.round(currentData.maintenanceCosts / currentData.vehicleCount).toLocaleString()} €</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">ROI Flotte</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {((currentData.profit / currentData.totalExpenses) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Retour sur investissement mensuel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Financial Table */}
      <Card>
        <CardHeader>
          <CardTitle>Détail financier - Évolution 3 mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-muted-foreground">Période</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Revenus</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Dépenses</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Bénéfice</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Marge</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Rev/Véhicule</th>
                </tr>
              </thead>
              <tbody>
                {mockFinancialData.map((data, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{data.period}</td>
                    <td className="p-4 text-right font-medium text-green-600">
                      {data.totalRevenue.toLocaleString()} €
                    </td>
                    <td className="p-4 text-right font-medium text-red-600">
                      {data.totalExpenses.toLocaleString()} €
                    </td>
                    <td className="p-4 text-right font-bold">
                      {data.profit.toLocaleString()} €
                    </td>
                    <td className="p-4 text-right">
                      {((data.profit / data.totalRevenue) * 100).toFixed(1)}%
                    </td>
                    <td className="p-4 text-right">
                      {data.avgRevenuePerVehicle.toLocaleString()} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 