"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRolePermissions, ProtectedComponent } from '@/hooks/use-role-permissions'
import { Calendar, Clock, User, Plus, Edit, AlertTriangle } from 'lucide-react'

interface DriverSchedule {
  id: string
  driverId: string
  driverName: string
  date: string
  shiftStart: string
  shiftEnd: string
  breakTime: number
  totalHours: number
  assignments: string[]
  status: 'planned' | 'active' | 'completed' | 'overtime'
  vehicleAssigned?: string
}

const mockSchedules: DriverSchedule[] = [
  {
    id: '1',
    driverId: 'd1',
    driverName: 'Pierre Martin',
    date: '2024-03-16',
    shiftStart: '06:00',
    shiftEnd: '18:00',
    breakTime: 60,
    totalHours: 11,
    assignments: ['Livraison Paris-Lyon', 'Retour à vide'],
    status: 'active',
    vehicleAssigned: 'TC-001-FR'
  },
  {
    id: '2',
    driverId: 'd2',
    driverName: 'Marie Dubois',
    date: '2024-03-16',
    shiftStart: '08:00',
    shiftEnd: '16:00',
    breakTime: 30,
    totalHours: 7.5,
    assignments: ['Transport régional'],
    status: 'planned',
    vehicleAssigned: 'TC-002-FR'
  },
  {
    id: '3',
    driverId: 'd1',
    driverName: 'Pierre Martin',
    date: '2024-03-17',
    shiftStart: '05:00',
    shiftEnd: '19:00',
    breakTime: 90,
    totalHours: 12.5,
    assignments: ['Livraison express', 'Transport longue distance'],
    status: 'overtime',
    vehicleAssigned: 'TC-001-FR'
  }
]

export default function DriverSchedulesPage() {
  const { hasPermission } = useRolePermissions()
  const [schedules] = useState<DriverSchedule[]>(mockSchedules)
  const [selectedDate, setSelectedDate] = useState<string>('2024-03-16')
  const [selectedDriver, setSelectedDriver] = useState<string>('all')

  const filteredSchedules = schedules.filter(schedule => {
    const dateMatch = schedule.date === selectedDate
    const driverMatch = selectedDriver === 'all' || schedule.driverId === selectedDriver
    return dateMatch && driverMatch
  })

  const getStatusBadge = (status: DriverSchedule['status']) => {
    const statusConfig = {
      planned: { label: 'Planifié', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      active: { label: 'Actif', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      completed: { label: 'Terminé', className: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300' },
      overtime: { label: 'Heures sup.', className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' }
    }
    
    const config = statusConfig[status]
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const scheduleStats = {
    total: filteredSchedules.length,
    active: filteredSchedules.filter(s => s.status === 'active').length,
    overtime: filteredSchedules.filter(s => s.status === 'overtime').length,
    totalHours: filteredSchedules.reduce((sum, s) => sum + s.totalHours, 0)
  }

  const drivers = Array.from(new Set(schedules.map(s => ({ id: s.driverId, name: s.driverName }))))

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plannings Chauffeurs</h1>
          <p className="text-muted-foreground">
            Gérez les horaires de travail de vos chauffeurs
          </p>
        </div>
        <ProtectedComponent resource="drivers" action="update">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau planning
          </Button>
        </ProtectedComponent>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          <option value="all">Tous les chauffeurs</option>
          {drivers.map(driver => (
            <option key={driver.id} value={driver.id}>{driver.name}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Chauffeurs planifiés</p>
                <p className="text-2xl font-bold text-foreground">{scheduleStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold text-foreground">{scheduleStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Heures sup.</p>
                <p className="text-2xl font-bold text-foreground">{scheduleStats.overtime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total heures</p>
                <p className="text-2xl font-bold text-foreground">{scheduleStats.totalHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {filteredSchedules.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucun planning pour cette date</p>
            </CardContent>
          </Card>
        ) : (
          filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{schedule.driverName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {schedule.vehicleAssigned && `Véhicule: ${schedule.vehicleAssigned}`}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(schedule.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Horaires</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.shiftStart} - {schedule.shiftEnd}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total heures</p>
                    <p className="text-sm text-muted-foreground">{schedule.totalHours}h</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pause</p>
                    <p className="text-sm text-muted-foreground">{schedule.breakTime} min</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Missions</p>
                    <p className="text-sm text-muted-foreground">{schedule.assignments.length}</p>
                  </div>
                </div>

                {/* Assignments */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Missions assignées</p>
                  <div className="flex flex-wrap gap-2">
                    {schedule.assignments.map((assignment, index) => (
                      <Badge key={index} variant="outline">
                        {assignment}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Overtime Warning */}
                {schedule.status === 'overtime' && (
                  <div className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg mb-4">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-orange-700 dark:text-orange-300">
                      Attention: Dépassement des heures réglementaires
                    </span>
                  </div>
                )}

                {/* Actions */}
                <ProtectedComponent resource="drivers" action="update">
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Modifier planning
                    </Button>
                    <Button variant="outline" size="sm">
                      Voir détails
                    </Button>
                  </div>
                </ProtectedComponent>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle>Vue hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Chauffeur</th>
                  <th className="text-center p-3">Lun</th>
                  <th className="text-center p-3">Mar</th>
                  <th className="text-center p-3">Mer</th>
                  <th className="text-center p-3">Jeu</th>
                  <th className="text-center p-3">Ven</th>
                  <th className="text-center p-3">Sam</th>
                  <th className="text-center p-3">Dim</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <tr key={driver.id} className="border-b hover:bg-muted/50">
                    <td className="p-3 font-medium">{driver.name}</td>
                    <td className="p-3 text-center text-muted-foreground">8h-16h</td>
                    <td className="p-3 text-center text-muted-foreground">6h-18h</td>
                    <td className="p-3 text-center text-muted-foreground">-</td>
                    <td className="p-3 text-center text-muted-foreground">7h-15h</td>
                    <td className="p-3 text-center text-muted-foreground">8h-16h</td>
                    <td className="p-3 text-center text-muted-foreground">-</td>
                    <td className="p-3 text-center text-muted-foreground">-</td>
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