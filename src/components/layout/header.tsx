'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { UserMenu } from '@/components/layout/user-menu'
import { useAuth } from '@/hooks/use-permissions'
import { 
  Search, 
  Bell, 
  Settings, 
  Zap,
  Globe,
  Activity,
  ChevronDown,
  Command
} from 'lucide-react'

export function Header() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications] = useState(3) // Mock notifications count

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        {/* Logo et titre */}
        <div className="flex items-center space-x-4 mr-8">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center shadow-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
          </div>
          <div className="hidden md:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              FleetManager Pro
            </h1>
            <p className="text-xs text-muted-foreground">
              {user?.role.name || 'Système de gestion'}
            </p>
          </div>
        </div>

        {/* Barre de recherche premium */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Rechercher missions, véhicules, chauffeurs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                       transition-all duration-200 placeholder:text-muted-foreground/60
                       hover:bg-muted/70 group-focus-within:bg-background"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <Command className="h-3 w-3" />
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center space-x-2">
          {/* Statut système */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              Système opérationnel
            </span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative hover:bg-muted/50">
            <Bell className="h-4 w-4" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-500">
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Paramètres rapides */}
          <Button variant="ghost" size="sm" className="hover:bg-muted/50">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Toggle thème avec style premium */}
          <div className="mx-2">
            <ThemeToggle />
          </div>

          {/* Séparateur */}
          <div className="w-px h-6 bg-border mx-2"></div>

          {/* Menu utilisateur */}
          <UserMenu />
        </div>
      </div>

      {/* Barre d'état avec métriques temps réel */}
      <div className="border-t border-border/40 bg-muted/20">
        <div className="flex items-center justify-between px-6 py-2 text-xs">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="text-muted-foreground">Flotte active:</span>
              <span className="font-medium text-foreground">18/25</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-3 w-3 text-blue-500" />
              <span className="text-muted-foreground">Missions en cours:</span>
              <span className="font-medium text-foreground">8</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-muted-foreground">Maintenance:</span>
              <span className="font-medium text-foreground">2 véhicules</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 text-muted-foreground">
            <span>Dernière sync: il y a 2 min</span>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
              <span>Temps réel</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 