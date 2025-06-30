"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDemoAuth, ProtectedComponent } from '@/components/providers/demo-auth-provider'
import { Calendar, Clock, User, Plus, Search } from 'lucide-react'

interface Schedule {
  id: string
  driverId: string
  driverName: string
  date: string
  startTime: string
  endTime: string
  totalHours: number
  overtime: number
  status: 'scheduled' | 'active' | 'completed'
  mission?: string
}

const mockSchedules: Schedule[] = [
  {
    id: '1',
    driverId: 'd1',
    driverName: 'Pierre Martin',
    date: '2024-03-18',
    startTime: '08:00',
    endTime: '18:00',
    totalHours: 10,
    overtime: 2,
    status: 'scheduled',
    mission: 'Livraison Paris-Lyon'
  },
  {
    id: '2',
    driverId: 'd2',
    driverName: 'Marie Dubois',
    date: '2024-03-18',
    startTime: '06:00',
    endTime: '14:00',
    totalHours: 8,
    overtime: 0,
    status: 'active',
    mission: 'Transport Marseille-Nice'
  }
]

export default function DriverSchedulesPage() {
  const [schedules] = useState<Schedule[]>(mockSchedules)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusBadge = (status: Schedule['status']) => {
    const config = {
      scheduled: { label: 'Planifié', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' },
      active: { label: 'En cours', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700' },
      completed: { label: 'Terminé', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700' }
    }
    
    const { label, className } = config[status]
    return <Badge className={`${className} border`}>{label}</Badge>
  }

  const filteredSchedules = schedules.filter(schedule => 
    schedule.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.mission?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Horaires Conducteurs</h1>
          <p className="text-muted-foreground">
            Gérez les plannings de vos conducteurs
          </p>
        </div>
        <ProtectedComponent resource="drivers" action="create">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau planning
          </Button>
        </ProtectedComponent>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un planning..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-background text-foreground"
        />
      </div>

      {/* Schedules List */}
      <div className="grid gap-4">
        {filteredSchedules.map((schedule) => (
          <Card key={schedule.id} className="card-hover">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-foreground">{schedule.driverName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(schedule.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Horaires</p>
                      <p className="font-semibold text-foreground">{schedule.startTime} - {schedule.endTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total heures</p>
                      <p className="font-semibold text-foreground">{schedule.totalHours}h</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Heures sup.</p>
                      <p className={`font-semibold ${schedule.overtime > 0 ? 'text-orange-600' : 'text-foreground'}`}>
                        {schedule.overtime}h
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mission</p>
                      <p className="font-semibold text-foreground">{schedule.mission || 'Non assignée'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                  {getStatusBadge(schedule.status)}
                  <ProtectedComponent resource="drivers" action="update">
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
    </div>
  )
} 
