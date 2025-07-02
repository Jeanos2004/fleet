'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts'

// Interface pour les données de maintenance
interface MaintenanceData {
  month: string
  preventive: number
  corrective: number
  cost: number
  vehicles: number
}

interface MaintenanceChartsProps {
  data?: MaintenanceData[]
}

// Données mockées pour la maintenance
const mockMaintenanceData: MaintenanceData[] = [
  { month: 'Jan', preventive: 15, corrective: 8, cost: 25000, vehicles: 23 },
  { month: 'Fév', preventive: 18, corrective: 5, cost: 18000, vehicles: 23 },
  { month: 'Mar', preventive: 12, corrective: 12, cost: 35000, vehicles: 24 },
  { month: 'Avr', preventive: 20, corrective: 7, cost: 22000, vehicles: 24 },
  { month: 'Mai', preventive: 16, corrective: 9, cost: 28000, vehicles: 25 },
  { month: 'Juin', preventive: 14, corrective: 6, cost: 19000, vehicles: 25 }
]

// Graphique des interventions par type
export function MaintenanceTypeChart({ data = mockMaintenanceData }: MaintenanceChartsProps) {
  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Interventions par Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="preventive" 
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              name="Préventive"
            />
            <Bar 
              dataKey="corrective" 
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              name="Corrective"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Graphique des coûts de maintenance
export function MaintenanceCostChart({ data = mockMaintenanceData }: MaintenanceChartsProps) {
  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Évolution des Coûts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [`${value.toLocaleString()}€`, 'Coût']}
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Graphique de répartition préventif vs correctif
export function MaintenanceDistributionChart({ data = mockMaintenanceData }: MaintenanceChartsProps) {
  const totalPreventive = data.reduce((sum, item) => sum + item.preventive, 0)
  const totalCorrective = data.reduce((sum, item) => sum + item.corrective, 0)
  
  const distributionData = [
    {
      name: 'Maintenance Préventive',
      value: totalPreventive,
      color: '#10b981'
    },
    {
      name: 'Maintenance Corrective',
      value: totalCorrective,
      color: '#ef4444'
    }
  ]

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Répartition des Interventions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {distributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {distributionData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.value})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Graphique combiné coûts et interventions
export function MaintenanceOverviewChart({ data = mockMaintenanceData }: MaintenanceChartsProps) {
  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          Vue d'ensemble - Coûts & Interventions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar 
              yAxisId="left"
              dataKey="preventive" 
              fill="#10b981"
              name="Préventive"
            />
            <Bar 
              yAxisId="left"
              dataKey="corrective" 
              fill="#ef4444"
              name="Corrective"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cost"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              name="Coût (€)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Graphique de tendance de fiabilité
export function MaintenanceReliabilityChart({ data = mockMaintenanceData }: MaintenanceChartsProps) {
  const reliabilityData = data.map(item => ({
    ...item,
    reliability: ((item.preventive / (item.preventive + item.corrective)) * 100).toFixed(1),
    mtbf: (720 / (item.preventive + item.corrective)).toFixed(1) // Mean Time Between Failures (heures)
  }))

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          Indicateur de Fiabilité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={reliabilityData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [`${value}%`, 'Fiabilité']}
            />
            <Line
              type="monotone"
              dataKey="reliability"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 