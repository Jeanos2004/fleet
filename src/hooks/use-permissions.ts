'use client'

import { useState, useEffect } from 'react'
import { User, PermissionCode, RoleCode, PREDEFINED_ROLES } from '@/lib/types/auth'

// Interface pour le contexte d'authentification
interface AuthContextType {
  user: User | null
  isLoading: boolean
  hasPermission: (permission: PermissionCode) => boolean
  hasRole: (role: RoleCode) => boolean
  hasAnyRole: (roles: RoleCode[]) => boolean
  canAccess: (resource: string, action: string) => boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Mock data pour les utilisateurs
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@fleet.com',
    firstName: 'Admin',
    lastName: 'System',
    role: {
      id: '1',
      name: 'Administrateur',
      code: 'ADMIN',
      description: 'Accès complet au système',
      permissions: PREDEFINED_ROLES.ADMIN.permissions.map(code => ({
        id: code,
        name: code,
        code,
        resource: code.split('_')[0],
        action: code.split('_')[1] || 'ALL',
        description: `Permission ${code}`
      })),
      level: 1
    },
    permissions: [],
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'transport@fleet.com',
    firstName: 'Jean',
    lastName: 'Martin',
    role: {
      id: '2',
      name: 'Responsable Transport',
      code: 'TRANSPORT_MANAGER',
      description: 'Gestion des opérations de transport',
      permissions: PREDEFINED_ROLES.TRANSPORT_MANAGER.permissions.map(code => ({
        id: code,
        name: code,
        code,
        resource: code.split('_')[0],
        action: code.split('_')[1] || 'ALL',
        description: `Permission ${code}`
      })),
      level: 2
    },
    permissions: [],
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date()
  }
]

// Hook personnalisé pour la gestion des permissions
export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Par défaut, connecter en tant qu'admin pour la démo
    setUser(mockUsers[0])
    setIsLoading(false)
  }, [])

  const hasPermission = (permission: PermissionCode): boolean => {
    if (!user) return false
    if (user.role.code === 'ADMIN') return true
    return user.role.permissions.some(p => p.code === permission)
  }

  const hasRole = (role: RoleCode): boolean => {
    if (!user) return false
    return user.role.code === role
  }

  const hasAnyRole = (roles: RoleCode[]): boolean => {
    if (!user) return false
    return roles.includes(user.role.code)
  }

  const canAccess = (resource: string, action: string): boolean => {
    if (!user) return false
    
    // L'admin peut tout faire
    if (user.role.code === 'ADMIN') return true
    
    return user.role.permissions.some(p => 
      p.resource.toLowerCase() === resource.toLowerCase() && 
      (p.action.toLowerCase() === action.toLowerCase() || p.action === 'ALL')
    )
  }

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      // Simuler l'authentification
      const foundUser = mockUsers.find(u => u.email === email)
      if (foundUser && password === 'password') {
        setUser(foundUser)
        localStorage.setItem('currentUser', JSON.stringify(foundUser))
      } else {
        throw new Error('Identifiants invalides')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = (): void => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return {
    user,
    isLoading,
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccess,
    login,
    logout
  }
}

// Hook alias pour la compatibilité
export const usePermissions = useAuth 