'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface Mission {
  id: string
  title: string
  vehicleId: string
  vehiclePlate: string
  driverId: string
  driverName: string
  origin: string
  destination: string
  startDate: string
  endDate: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  distance: number
  cargo: string
  priority: 'low' | 'medium' | 'high'
}

interface MissionsChartProps {
  missions: Mission[]
}

export function MissionsStatusChart({ missions }: MissionsChartProps) {
  const statusData = [
    {
      name: 'Terminées',
      value: missions.filter(m => m.status === 'completed').length,
      color: '#10b981'
    },
    {
      name: 'En cours',
      value: missions.filter(m => m.status === 'in_progress').length,
      color: '#f59e0b'
    },
    {
      name: 'Planifiées',
      value: missions.filter(m => m.status === 'planned').length,
      color: '#3b82f6'
    },
    {
      name: 'Annulées',
      value: missions.filter(m => m.status === 'cancelled').length,
      color: '#ef4444'
    }
  ].filter(item => item.value > 0)

  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des Missions par Statut</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function MissionsDistanceChart({ missions }: MissionsChartProps) {
  const distanceData = missions.map(mission => ({
    name: mission.title.split(' - ')[0] || mission.title.substring(0, 15) + '...',
    distance: mission.distance,
    status: mission.status
  })).sort((a, b) => b.distance - a.distance).slice(0, 6)

  const getBarColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'in_progress': return '#f59e0b'
      case 'planned': return '#3b82f6'
      case 'cancelled': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distances par Mission</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="fill-muted-foreground text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="fill-muted-foreground text-xs" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="distance" name="Distance (km)">
                {distanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function MissionsPriorityChart({ missions }: MissionsChartProps) {
  const priorityData = [
    {
      name: 'Haute',
      value: missions.filter(m => m.priority === 'high').length,
      color: '#ef4444'
    },
    {
      name: 'Moyenne',
      value: missions.filter(m => m.priority === 'medium').length,
      color: '#f59e0b'
    },
    {
      name: 'Basse',
      value: missions.filter(m => m.priority === 'low').length,
      color: '#10b981'
    }
  ].filter(item => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par Priorité</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}