"use client"

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import React from 'react'

export interface Permission {
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

export interface RolePermissions {
  dashboard: Permission
  vehicles: Permission
  drivers: Permission
  missions: Permission
  maintenance: Permission
  finance: Permission
  reports: Permission
  audit: Permission
  settings: Permission
  users: Permission
}

const ROLE_PERMISSIONS: Record<string, RolePermissions> = {
  admin: {
    dashboard: { create: true, read: true, update: true, delete: true },
    vehicles: { create: true, read: true, update: true, delete: true },
    drivers: { create: true, read: true, update: true, delete: true },
    missions: { create: true, read: true, update: true, delete: true },
    maintenance: { create: true, read: true, update: true, delete: true },
    finance: { create: true, read: true, update: true, delete: true },
    reports: { create: true, read: true, update: true, delete: true },
    audit: { create: true, read: true, update: true, delete: true },
    settings: { create: true, read: true, update: true, delete: true },
    users: { create: true, read: true, update: true, delete: true }
  },
  transport_manager: {
    dashboard: { create: false, read: true, update: false, delete: false },
    vehicles: { create: true, read: true, update: true, delete: false },
    drivers: { create: true, read: true, update: true, delete: false },
    missions: { create: true, read: true, update: true, delete: true },
    maintenance: { create: true, read: true, update: true, delete: false },
    finance: { create: false, read: true, update: false, delete: false },
    reports: { create: true, read: true, update: false, delete: false },
    audit: { create: false, read: true, update: false, delete: false },
    settings: { create: false, read: true, update: true, delete: false },
    users: { create: false, read: true, update: false, delete: false }
  },
  driver: {
    dashboard: { create: false, read: true, update: false, delete: false },
    vehicles: { create: false, read: true, update: false, delete: false },
    drivers: { create: false, read: true, update: true, delete: false },
    missions: { create: false, read: true, update: true, delete: false },
    maintenance: { create: true, read: true, update: false, delete: false },
    finance: { create: false, read: false, update: false, delete: false },
    reports: { create: false, read: false, update: false, delete: false },
    audit: { create: false, read: false, update: false, delete: false },
    settings: { create: false, read: true, update: true, delete: false },
    users: { create: false, read: false, update: false, delete: false }
  },
  technician: {
    dashboard: { create: false, read: true, update: false, delete: false },
    vehicles: { create: false, read: true, update: true, delete: false },
    drivers: { create: false, read: true, update: false, delete: false },
    missions: { create: false, read: true, update: false, delete: false },
    maintenance: { create: true, read: true, update: true, delete: false },
    finance: { create: false, read: false, update: false, delete: false },
    reports: { create: true, read: true, update: false, delete: false },
    audit: { create: false, read: false, update: false, delete: false },
    settings: { create: false, read: true, update: true, delete: false },
    users: { create: false, read: false, update: false, delete: false }
  },
  finance: {
    dashboard: { create: false, read: true, update: false, delete: false },
    vehicles: { create: false, read: true, update: false, delete: false },
    drivers: { create: false, read: true, update: false, delete: false },
    missions: { create: false, read: true, update: false, delete: false },
    maintenance: { create: false, read: true, update: false, delete: false },
    finance: { create: true, read: true, update: true, delete: false },
    reports: { create: true, read: true, update: true, delete: false },
    audit: { create: false, read: true, update: false, delete: false },
    settings: { create: false, read: true, update: true, delete: false },
    users: { create: false, read: false, update: false, delete: false }
  }
}

export function useRolePermissions() {
  const { data: session } = useSession()
  
  const userRole = useMemo(() => {
    if (!session?.user?.email) return 'guest'
    
    const roleMapping: Record<string, string> = {
      'admin@fleetmanager.com': 'admin',
      'transport@fleetmanager.com': 'transport_manager',
      'chauffeur1@fleetmanager.com': 'driver',
      'tech@fleetmanager.com': 'technician',
      'finance@fleetmanager.com': 'finance'
    }
    
    return roleMapping[session.user.email] || 'guest'
  }, [session])

  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[userRole] || {
      dashboard: { create: false, read: false, update: false, delete: false },
      vehicles: { create: false, read: false, update: false, delete: false },
      drivers: { create: false, read: false, update: false, delete: false },
      missions: { create: false, read: false, update: false, delete: false },
      maintenance: { create: false, read: false, update: false, delete: false },
      finance: { create: false, read: false, update: false, delete: false },
      reports: { create: false, read: false, update: false, delete: false },
      audit: { create: false, read: false, update: false, delete: false },
      settings: { create: false, read: false, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false }
    }
  }, [userRole])

  const hasPermission = (resource: keyof RolePermissions, action: keyof Permission) => {
    return permissions[resource]?.[action] || false
  }

  const canAccess = (resource: keyof RolePermissions) => {
    return permissions[resource]?.read || false
  }

  const isAdmin = userRole === 'admin'
  const isTransportManager = userRole === 'transport_manager'
  const isDriver = userRole === 'driver'
  const isTechnician = userRole === 'technician'
  const isFinance = userRole === 'finance'

  return {
    userRole,
    permissions,
    hasPermission,
    canAccess,
    isAdmin,
    isTransportManager,
    isDriver,
    isTechnician,
    isFinance
  }
}

interface ProtectedComponentProps {
  resource: keyof RolePermissions
  action?: keyof Permission
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedComponent({ 
  resource, 
  action = 'read',
  children,
  fallback = null 
}: ProtectedComponentProps) {
  const { hasPermission } = useRolePermissions()
  
  if (!hasPermission(resource, action)) {
    return fallback as React.ReactElement
  }
  
  return children as React.ReactElement
} 