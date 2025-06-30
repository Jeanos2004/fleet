"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PerformanceData {
  month: string
  deliveries: number
  revenue: number
  costs: number
  efficiency: number
}

const data: PerformanceData[] = [
  { month: 'Jan', deliveries: 145, revenue: 25000, costs: 18000, efficiency: 92 },
  { month: 'Fév', deliveries: 168, revenue: 28500, costs: 19500, efficiency: 94 },
  { month: 'Mar', deliveries: 192, revenue: 32000, costs: 21000, efficiency: 96 },
  { month: 'Avr', deliveries: 175, revenue: 29800, costs: 20200, efficiency: 93 },
  { month: 'Mai', deliveries: 210, revenue: 35500, costs: 22500, efficiency: 97 },
  { month: 'Juin', deliveries: 198, revenue: 33200, costs: 21800, efficiency: 95 }
]

export function PerformanceChart() {
  const maxDeliveries = Math.max(...data.map(d => d.deliveries))
  const maxRevenue = Math.max(...data.map(d => d.revenue))
  
  return (
    <div className="space-y-6">
      {/* Graphique en barres pour les livraisons */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Évolution des Livraisons</h3>
        <div className="flex items-end justify-between h-64 bg-gradient-to-t from-muted/20 to-transparent rounded-lg p-4">
          {data.map((item, index) => (
            <div key={item.month} className="flex flex-col items-center gap-2">
              <div className="text-xs font-medium text-muted-foreground">
                {item.deliveries}
              </div>
              <div 
                className="w-8 bg-gradient-to-t from-primary to-primary/60 rounded-t-sm transition-all hover:from-primary/80 hover:to-primary/40 cursor-pointer"
                style={{ 
                  height: `${(item.deliveries / maxDeliveries) * 200}px`,
                  minHeight: '20px'
                }}
              />
              <div className="text-xs font-medium">{item.month}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphique linéaire pour les revenus */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Revenus vs Coûts</h3>
        <div className="relative h-48 bg-gradient-to-br from-green-50 to-red-50 dark:from-green-950 dark:to-red-950 rounded-lg p-4">
          <div className="absolute inset-4">
            <svg className="w-full h-full" viewBox="0 0 300 120">
              {/* Ligne des revenus */}
              <polyline
                fill="none"
                stroke="rgb(34, 197, 94)"
                strokeWidth="3"
                points={data.map((item, index) => 
                  `${(index * 50) + 25},${120 - (item.revenue / maxRevenue) * 100}`
                ).join(' ')}
              />
              {/* Ligne des coûts */}
              <polyline
                fill="none"
                stroke="rgb(239, 68, 68)"
                strokeWidth="3"
                points={data.map((item, index) => 
                  `${(index * 50) + 25},${120 - (item.costs / maxRevenue) * 100}`
                ).join(' ')}
              />
              {/* Points pour les revenus */}
              {data.map((item, index) => (
                <circle
                  key={`revenue-${index}`}
                  cx={(index * 50) + 25}
                  cy={120 - (item.revenue / maxRevenue) * 100}
                  r="4"
                  fill="rgb(34, 197, 94)"
                  className="hover:r-6 transition-all cursor-pointer"
                />
              ))}
              {/* Points pour les coûts */}
              {data.map((item, index) => (
                <circle
                  key={`cost-${index}`}
                  cx={(index * 50) + 25}
                  cy={120 - (item.costs / maxRevenue) * 100}
                  r="4"
                  fill="rgb(239, 68, 68)"
                  className="hover:r-6 transition-all cursor-pointer"
                />
              ))}
            </svg>
          </div>
          <div className="absolute bottom-2 left-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Revenus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>Coûts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs d'efficacité */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Efficacité par Mois</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {data.map((item, index) => (
            <Card key={item.month} className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">
                  {item.efficiency}%
                </div>
                <div className="text-xs text-muted-foreground">{item.month}</div>
                <div className="mt-2">
                  {item.efficiency >= 95 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 