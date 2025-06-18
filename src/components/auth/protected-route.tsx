'use client'

import { useAuth } from '@/hooks/use-permissions'
import { PermissionCode, RoleCode } from '@/lib/types/auth'
import { Shield } from 'lucide-react'

// Composant HOC pour protéger les routes
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: PermissionCode
  requiredRole?: RoleCode
  requiredRoles?: RoleCode[]
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredPermission, 
  requiredRole, 
  requiredRoles,
  fallback 
}: ProtectedRouteProps) {
  const { user, hasPermission, hasRole, hasAnyRole, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Chargement...</span>
      </div>
    )
  }

  if (!user) {
    return fallback || (
      <div className="text-center p-8">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-red-500">Accès non autorisé</p>
      </div>
    )
  }

  // Vérifier les permissions
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="text-center p-8">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-red-500">Permission insuffisante</p>
      </div>
    )
  }

  // Vérifier le rôle unique
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || (
      <div className="text-center p-8">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-red-500">Rôle insuffisant</p>
      </div>
    )
  }

  // Vérifier les rôles multiples
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return fallback || (
      <div className="text-center p-8">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-red-500">Rôle insuffisant</p>
      </div>
    )
  }

  return <>{children}</>
}

// Composant pour afficher conditionnellement du contenu basé sur les permissions
interface ConditionalRenderProps {
  children: React.ReactNode
  permission?: PermissionCode
  role?: RoleCode
  roles?: RoleCode[]
  fallback?: React.ReactNode
}

export function ConditionalRender({ 
  children, 
  permission, 
  role, 
  roles, 
  fallback 
}: ConditionalRenderProps) {
  const { user, hasPermission, hasRole, hasAnyRole } = useAuth()

  if (!user) return fallback || null

  // Vérifier les permissions
  if (permission && !hasPermission(permission)) {
    return fallback || null
  }

  // Vérifier le rôle unique
  if (role && !hasRole(role)) {
    return fallback || null
  }

  // Vérifier les rôles multiples
  if (roles && !hasAnyRole(roles)) {
    return fallback || null
  }

  return <>{children}</>
} 