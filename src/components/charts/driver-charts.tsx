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
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts'

// Interface pour les données des chauffeurs
interface Driver {
  id: string
  nom: string
  prenom: string
  statut: string
  totalMissions: number
  rating: number
  experience?: number
  dateEmbauche: string
}

interface DriverChartsProps {
  drivers: Driver[]
}

// Graphique de performance des chauffeurs
export function DriverPerformanceChart({ drivers }: DriverChartsProps) {
  const performanceData = drivers
    .sort((a, b) => b.totalMissions - a.totalMissions)
    .slice(0, 6)
    .map(driver => ({
      name: `${driver.prenom} ${driver.nom.charAt(0)}.`,
      missions: driver.totalMissions,
      rating: driver.rating,
      efficiency: (driver.totalMissions / 100) * driver.rating * 20 // Score composite
    }))

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Performances des Chauffeurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={performanceData}
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
            <Bar 
              dataKey="missions" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Missions"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Graphique de répartition des statuts
export function DriverStatusChart({ drivers }: DriverChartsProps) {
  const statusData = [
    {
      name: 'Disponible',
      value: drivers.filter(d => d.statut === 'disponible').length,
      color: '#10b981'
    },
    {
      name: 'En mission',
      value: drivers.filter(d => d.statut === 'en_mission').length,
      color: '#3b82f6'
    },
    {
      name: 'Au repos',
      value: drivers.filter(d => d.statut === 'repos').length,
      color: '#f59e0b'
    },
    {
      name: 'Absent',
      value: drivers.filter(d => d.statut === 'absent').length,
      color: '#ef4444'
    }
  ]

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Disponibilité des Chauffeurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
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

// Graphique des évaluations
export function DriverRatingChart({ drivers }: DriverChartsProps) {
  const ratingData = drivers
    .sort((a, b) => b.rating - a.rating)
    .map(driver => ({
      name: `${driver.prenom} ${driver.nom.charAt(0)}.`,
      rating: driver.rating,
      missions: driver.totalMissions
    }))

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          Évaluations des Chauffeurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={ratingData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              domain={[0, 5]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [`${value}/5`, 'Note']}
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#eab308"
              strokeWidth={3}
              dot={{ fill: '#eab308', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Graphique d'expérience vs missions
export function DriverExperienceChart({ drivers }: DriverChartsProps) {
  const experienceData = drivers.map(driver => {
    const yearsExperience = driver.experience || 
      Math.floor((new Date().getTime() - new Date(driver.dateEmbauche).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    
    return {
      name: `${driver.prenom} ${driver.nom.charAt(0)}.`,
      experience: yearsExperience,
      missions: driver.totalMissions,
      efficiency: driver.totalMissions / Math.max(yearsExperience, 1)
    }
  })

  const getExperienceColor = (experience: number) => {
    if (experience < 2) return '#ef4444'
    if (experience < 5) return '#f59e0b'
    if (experience < 10) return '#3b82f6'
    return '#10b981'
  }

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Expérience vs Missions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={experienceData}
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
            <Bar 
              dataKey="experience" 
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              name="Années d'expérience"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

// Graphique radial des compétences
export function DriverSkillsRadialChart({ drivers }: DriverChartsProps) {
  const skillsData = drivers.slice(0, 5).map((driver, index) => ({
    name: `${driver.prenom} ${driver.nom.charAt(0)}.`,
    value: driver.rating * 20, // Convertir 0-5 en 0-100
    fill: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]
  }))

  return (
    <Card className="bg-background border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          Top 5 - Évaluations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="10%"
            outerRadius="80%"
            barSize={20}
            data={skillsData}
          >
            <RadialBar
              minAngle={15}
              label={{ position: 'insideStart', fill: '#fff' }}
              background
              clockWise
              dataKey="value"
            />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              wrapperStyle={{
                fontSize: '12px',
                color: 'hsl(var(--muted-foreground))'
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any) => [`${(value / 20).toFixed(1)}/5`, 'Note']}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
} 