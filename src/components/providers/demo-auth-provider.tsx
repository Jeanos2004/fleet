'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Types pour l'authentification
export interface DemoUser {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'TRANSPORT_MANAGER' | 'DRIVER' | 'TECHNICIAN' | 'FINANCE'
  isActive: boolean
  avatar?: string
}

interface AuthContextType {
  user: DemoUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  switchUser: (userId: string) => void
  hasPermission: (resource: string, action?: string) => boolean
  canAccessRoute: (route: string) => boolean
  isAdmin: boolean
  isTransportManager: boolean
  isDriver: boolean
  isTechnician: boolean
  isFinance: boolean
  demoUsers: DemoUser[]
}

// Utilisateurs de démonstration
const demoUsers: DemoUser[] = [
  {
    id: '1',
    email: 'admin@fleetmanager.com',
    name: 'Jean Administrateur',
    firstName: 'Jean',
    lastName: 'Administrateur',
    role: 'ADMIN',
    isActive: true
  },
  {
    id: '2',
    email: 'transport@fleetmanager.com',
    name: 'Marie Dubois',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: 'TRANSPORT_MANAGER',
    isActive: true
  },
  {
    id: '3',
    email: 'chauffeur1@fleetmanager.com',
    name: 'Jean Dupont',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'DRIVER',
    isActive: true
  },
  {
    id: '4',
    email: 'tech@fleetmanager.com',
    name: 'Pierre Martin',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: 'TECHNICIAN',
    isActive: true
  },
  {
    id: '5',
    email: 'finance@fleetmanager.com',
    name: 'Sophie Leroy',
    firstName: 'Sophie',
    lastName: 'Leroy',
    role: 'FINANCE',
    isActive: true
  }
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Récupérer l'utilisateur depuis le localStorage
    const savedUser = localStorage.getItem('demoUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error)
        localStorage.removeItem('demoUser')
      }
    } else {
      // Par défaut, connecter en tant qu'admin pour la démo
      const adminUser = demoUsers[0]
      setUser(adminUser)
      localStorage.setItem('demoUser', JSON.stringify(adminUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simuler un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = demoUsers.find(u => u.email === email)
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser)
      localStorage.setItem('demoUser', JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('demoUser')
  }

  const switchUser = (userId: string) => {
    const newUser = demoUsers.find(u => u.id === userId)
    if (newUser) {
      setUser(newUser)
      localStorage.setItem('demoUser', JSON.stringify(newUser))
    }
  }

  // Permissions par rôle
  const hasPermission = (resource: string, action: string = 'read'): boolean => {
    if (!user) return false
    
    // L'admin peut tout faire
    if (user.role === 'ADMIN') return true
    
    const permissions: Record<string, string[]> = {
      'TRANSPORT_MANAGER': [
        'dashboard:read', 'vehicles:read', 'vehicles:write', 'missions:read', 'missions:write',
        'drivers:read', 'drivers:write', 'maintenance:read', 'reports:read', 'telemetry:read',
        'notifications:read'
      ],
      'DRIVER': [
        'dashboard:read', 'missions:read', 'vehicles:read', 'telemetry:read', 'notifications:read'
      ],
      'TECHNICIAN': [
        'dashboard:read', 'vehicles:read', 'vehicles:write', 'maintenance:read', 'maintenance:write',
        'reports:read', 'notifications:read'
      ],
      'FINANCE': [
        'dashboard:read', 'reports:read', 'reports:write', 'missions:read', 'notifications:read'
      ]
    }
    
    const userPermissions = permissions[user.role] || []
    return userPermissions.includes(`${resource}:${action}`) || userPermissions.includes(`${resource}:*`)
  }

  const canAccessRoute = (route: string): boolean => {
    if (!user) return false
    
    // L'admin peut accéder à tout
    if (user.role === 'ADMIN') return true
    
    const routeAccess: Record<string, string[]> = {
      '/dashboard': ['ADMIN', 'TRANSPORT_MANAGER', 'DRIVER', 'TECHNICIAN', 'FINANCE'],
      '/vehicles': ['ADMIN', 'TRANSPORT_MANAGER', 'TECHNICIAN'],
      '/missions': ['ADMIN', 'TRANSPORT_MANAGER', 'DRIVER'],
      '/drivers': ['ADMIN', 'TRANSPORT_MANAGER'],
      '/maintenance': ['ADMIN', 'TRANSPORT_MANAGER', 'TECHNICIAN'],
      '/reports': ['ADMIN', 'TRANSPORT_MANAGER', 'FINANCE'],
      '/telemetry': ['ADMIN', 'TRANSPORT_MANAGER', 'DRIVER'],
      '/notifications': ['ADMIN', 'TRANSPORT_MANAGER', 'DRIVER', 'TECHNICIAN', 'FINANCE'],
      '/admin': ['ADMIN'],
      '/admin/users': ['ADMIN'],
      '/admin/audit': ['ADMIN'],
      '/admin/settings': ['ADMIN']
    }
    
    const allowedRoles = routeAccess[route] || []
    return allowedRoles.includes(user.role)
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    switchUser,
    hasPermission,
    canAccessRoute,
    isAdmin: user?.role === 'ADMIN',
    isTransportManager: user?.role === 'TRANSPORT_MANAGER',
    isDriver: user?.role === 'DRIVER',
    isTechnician: user?.role === 'TECHNICIAN',
    isFinance: user?.role === 'FINANCE',
    demoUsers
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useDemoAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider')
  }
  return context
} 

// Composant pour protéger l'accès aux fonctionnalités
interface ProtectedComponentProps {
  resource: string
  action?: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedComponent({ 
  resource, 
  action = 'read',
  children,
  fallback = null 
}: ProtectedComponentProps) {
  const { hasPermission } = useDemoAuth()
  
  if (!hasPermission(resource, action)) {
    return fallback as React.ReactElement
  }
  
  return children as React.ReactElement
}
