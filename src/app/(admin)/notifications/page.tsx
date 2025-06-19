import { NotificationCenter } from '@/components/notifications/notification-center'
import { Bell } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
              <p className="text-muted-foreground mt-2">
                Centre de gestion des alertes et notifications système
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Bell className="h-4 w-4" />
              <span>Notifications temps réel</span>
            </div>
          </div>
        </div>

        {/* Notification Center */}
        <div className="max-w-4xl mx-auto">
          <NotificationCenter />
        </div>
      </div>
    </div>
  )
} 