'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDemoAuth } from '@/components/providers/demo-auth-provider'
import { User, Settings, LogOut, Shield, Users } from 'lucide-react'

export function UserMenu() {
  const { user, logout, switchUser, demoUsers } = useDemoAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [showUserSwitcher, setShowUserSwitcher] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    // Rediriger vers la page de connexion si nécessaire
    window.location.href = '/auth/signin'
  }

  const handleSwitchUser = (userId: string) => {
    switchUser(userId)
    setShowUserSwitcher(false)
    setIsOpen(false)
  }

  const roleLabels = {
    ADMIN: 'Administrateur',
    TRANSPORT_MANAGER: 'Resp. Transport',
    DRIVER: 'Chauffeur',
    TECHNICIAN: 'Technicien',
    FINANCE: 'Finance'
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 h-auto hover:bg-accent"
      >
        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="text-left hidden md:block">
          <div className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-xs text-muted-foreground">
            {roleLabels[user.role]}
          </div>
        </div>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border rounded-xl shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>
            
            <Badge className="mb-4">
              <Shield className="h-3 w-3 mr-1" />
              {roleLabels[user.role]}
            </Badge>

            <div className="space-y-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => setShowUserSwitcher(!showUserSwitcher)}
              >
                <Users className="h-4 w-4 mr-2" />
                Changer d'utilisateur
              </Button>
              
              {showUserSwitcher && (
                <div className="ml-4 space-y-1 p-2 bg-muted/50 rounded-lg">
                  {demoUsers.map((demoUser) => (
                    <Button
                      key={demoUser.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start text-xs ${
                        demoUser.id === user.id ? 'bg-primary/10 text-primary' : ''
                      }`}
                      onClick={() => handleSwitchUser(demoUser.id)}
                      disabled={demoUser.id === user.id}
                    >
                      <User className="h-3 w-3 mr-2" />
                      {demoUser.firstName} {demoUser.lastName}
                      <span className="ml-auto text-xs text-muted-foreground">
                        {roleLabels[demoUser.role]}
                      </span>
                    </Button>
                  ))}
                </div>
              )}
              
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  )
} 