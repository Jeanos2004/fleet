'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { SystemNotifications, useSystemNotifications } from '@/components/notifications/system-notifications'
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Truck,
  ChevronDown
} from 'lucide-react'

interface HeaderProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
  showNotifications?: boolean
}

export function Header({ 
  title = "Dashboard", 
  subtitle = "Gérez votre flotte intelligemment",
  showSearch = true,
  showNotifications = true 
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  // Utiliser le système de notifications
  const { notifications, markAsRead, markAllAsRead, dismiss } = useSystemNotifications()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return null
  }

  return (
    <motion.header 
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-between px-4">
        
        {/* Left Side - Logo & Title */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FleetPro
              </h1>
            </div>
          </motion.div>

          {/* Page Title */}
          <div className="hidden md:block border-l border-border pl-4">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Center - Search */}
        {showSearch && (
          <motion.div 
            className="hidden lg:flex flex-1 max-w-md mx-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher véhicules, missions, chauffeurs..."
                className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm 
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                         transition-all duration-200 hover:bg-muted/70"
              />
            </div>
          </motion.div>
        )}

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2">
          
          {/* Theme Toggle - ULTRA STYLÉ ! 🔥 */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="relative h-9 w-9 rounded-lg dark:from-slate-800 dark:to-slate-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300 shadow-sm hover:shadow-md border border-blue-200/50 dark:border-slate-600/50"
            >
              <motion.div
                key={theme}
                initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                transition={{ 
                  duration: 0.5, 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15
                }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-orange-500 drop-shadow-sm filter drop-shadow-lg" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-600 drop-shadow-sm filter drop-shadow-lg" />
                )}
              </motion.div>
              
              {/* Petit effet de glow */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-indigo-400/20 dark:from-orange-400/20 dark:to-yellow-400/20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </Button>
          </motion.div>

          {/* Notifications System */}
          {showNotifications && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SystemNotifications
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onDismiss={dismiss}
              />
            </motion.div>
          )}

          {/* User Menu */}
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 h-9 px-3 rounded-lg bg-muted/50 hover:bg-muted transition-all duration-200"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:block text-sm font-medium">Admin</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </motion.div>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50"
              >
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium">Jean Administrateur</p>
                    <p className="text-xs text-muted-foreground">admin@fleetmanager.com</p>
                  </div>
                  <div className="py-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profil
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border bg-background/95 backdrop-blur"
        >
          <div className="container px-4 py-3">
            <div className="space-y-2">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm"
                />
              </div>
              
              {/* Page Title for Mobile */}
              <div className="py-2">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
} 