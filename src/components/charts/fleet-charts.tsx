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
  AreaChart
} from 'recharts'

// Interface pour les données des véhicules
interface Vehicle {
  id: string
  statut: string
  kilometrage: number
  capacite: number
  annee?: number
  type?: string
}

interface FleetChartsProps {
  vehicles: Vehicle[]
}

// Graphique de répartition par statut
export function FleetStatusChart({ vehicles }: FleetChartsProps) {
  const statusData = [
    {
      name: 'Disponible',
      value: vehicles.filter(v => v.statut === 'disponible').length,
      color: '#10b981'
    },
    {
      name: 'En mission',
      value: vehicles.filter(v => v.statut === 'en_mission').length,
      color: '#3b82f6'
    },
    {
      name: 'Maintenance',
      value: vehicles.filter(v => v.statut === 'maintenance').length,
      color: '#f59e0b'
    },
    {
      name: 'Panne',
      value: vehicles.filter(v => v.statut === 'panne').length,
      color: '#ef4444'
    }
  ]

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent === 0) return null
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
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Répartition par Statut
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
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
          {statusData.map((item, index) => (
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

// Graphique de kilométrage par véhicule
export function FleetMileageChart({ vehicles }: FleetChartsProps) {
  const mileageData = vehicles
    .sort((a, b) => b.kilometrage - a.kilometrage)
    .slice(0, 8)
    .map(vehicle => ({
      name: vehicle.id,
      kilometrage: vehicle.kilometrage,
      status: vehicle.statut
    }))

  const getBarColor = (status: string) => {
    switch (status) {
      case 'disponible': return '#10b981'
      case 'en_mission': return '#3b82f6'
      case 'maintenance': return '#f59e0b'
      case 'panne': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Kilométrage par Véhicule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={mileageData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="name" 
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
              formatter={(value: any) => [`${value.toLocaleString()} km`, 'Kilométrage']}
            />
            <Bar 
              dataKey="kilometrage" 
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Graphique de capacité de la flotte
export function FleetCapacityChart({ vehicles }: FleetChartsProps) {
  const capacityData = vehicles.map(vehicle => ({
    name: vehicle.id,
    capacite: vehicle.capacite,
    utilisation: Math.random() * 100, // Simulation d'utilisation
    statut: vehicle.statut
  }))

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Capacité vs Utilisation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={capacityData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="name" 
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
            <Area
              type="monotone"
              dataKey="capacite"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="utilisation"
              stackId="2"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Graphique d'évolution de l'âge de la flotte
export function FleetAgeChart({ vehicles }: FleetChartsProps) {
  const currentYear = new Date().getFullYear()
  const ageData = vehicles.reduce((acc: any[], vehicle) => {
    const age = vehicle.annee ? currentYear - vehicle.annee : 0
    const ageGroup = age <= 2 ? 'Neuf (0-2 ans)' :
                   age <= 5 ? 'Récent (3-5 ans)' :
                   age <= 10 ? 'Moyen (6-10 ans)' : 'Ancien (10+ ans)'
    
    const existing = acc.find(item => item.name === ageGroup)
    if (existing) {
      existing.count += 1
    } else {
      acc.push({ name: ageGroup, count: 1, age })
    }
    return acc
  }, [])

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444']

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          Répartition par Âge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={ageData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={100}
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
              dataKey="count" 
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 