// Types pour l'authentification et les rôles
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissions: Permission[]
  isActive: boolean
  createdAt: Date
  lastLogin?: Date
  avatar?: string
}

export interface UserRole {
  id: string
  name: string
  code: RoleCode
  description: string
  permissions: Permission[]
  level: number // Niveau hiérarchique (1 = admin, 2 = manager, etc.)
}

export type RoleCode = 
  | 'ADMIN'
  | 'TRANSPORT_MANAGER'
  | 'DISPATCHER'
  | 'DRIVER'
  | 'MECHANIC'
  | 'MAINTENANCE_MANAGER'
  | 'FINANCE_MANAGER'
  | 'SUPERVISOR'
  | 'CLIENT_MANAGER'

export interface Permission {
  id: string
  name: string
  code: PermissionCode
  resource: string
  action: string
  description: string
}

export type PermissionCode =
  // Missions
  | 'MISSION_CREATE'
  | 'MISSION_VIEW'
  | 'MISSION_EDIT'
  | 'MISSION_DELETE'
  | 'MISSION_ASSIGN'
  | 'MISSION_VALIDATE'
  
  // Flotte
  | 'FLEET_VIEW'
  | 'FLEET_MANAGE'
  | 'FLEET_TELEMETRY'
  
  // Maintenance
  | 'MAINTENANCE_VIEW'
  | 'MAINTENANCE_CREATE_WO'
  | 'MAINTENANCE_VALIDATE'
  | 'MAINTENANCE_SCHEDULE'
  
  // Finance
  | 'FINANCE_VIEW'
  | 'FINANCE_VALIDATE'
  | 'FINANCE_INVOICE'
  | 'FINANCE_REPORTS'
  
  // Administration
  | 'ADMIN_USERS'
  | 'ADMIN_ROLES'
  | 'ADMIN_SYSTEM'
  
  // Rapports
  | 'REPORTS_VIEW'
  | 'REPORTS_EXPORT'
  
  // Clients
  | 'CLIENT_VIEW'
  | 'CLIENT_MANAGE'

// Rôles prédéfinis avec leurs permissions
export const PREDEFINED_ROLES: Record<RoleCode, {
  name: string
  description: string
  permissions: PermissionCode[]
  level: number
}> = {
  ADMIN: {
    name: 'Administrateur',
    description: 'Accès complet au système',
    permissions: [
      'MISSION_CREATE', 'MISSION_VIEW', 'MISSION_EDIT', 'MISSION_DELETE', 'MISSION_ASSIGN', 'MISSION_VALIDATE',
      'FLEET_VIEW', 'FLEET_MANAGE', 'FLEET_TELEMETRY',
      'MAINTENANCE_VIEW', 'MAINTENANCE_CREATE_WO', 'MAINTENANCE_VALIDATE', 'MAINTENANCE_SCHEDULE',
      'FINANCE_VIEW', 'FINANCE_VALIDATE', 'FINANCE_INVOICE', 'FINANCE_REPORTS',
      'ADMIN_USERS', 'ADMIN_ROLES', 'ADMIN_SYSTEM',
      'REPORTS_VIEW', 'REPORTS_EXPORT',
      'CLIENT_VIEW', 'CLIENT_MANAGE'
    ],
    level: 1
  },
  TRANSPORT_MANAGER: {
    name: 'Responsable Transport',
    description: 'Gestion des opérations de transport',
    permissions: [
      'MISSION_CREATE', 'MISSION_VIEW', 'MISSION_EDIT', 'MISSION_ASSIGN', 'MISSION_VALIDATE',
      'FLEET_VIEW', 'FLEET_MANAGE', 'FLEET_TELEMETRY',
      'REPORTS_VIEW', 'REPORTS_EXPORT',
      'CLIENT_VIEW'
    ],
    level: 2
  },
  DISPATCHER: {
    name: 'Dispatcheur',
    description: 'Planification et suivi des missions',
    permissions: [
      'MISSION_CREATE', 'MISSION_VIEW', 'MISSION_EDIT', 'MISSION_ASSIGN',
      'FLEET_VIEW', 'FLEET_TELEMETRY',
      'REPORTS_VIEW'
    ],
    level: 3
  },
  DRIVER: {
    name: 'Chauffeur',
    description: 'Exécution des missions',
    permissions: [
      'MISSION_VIEW'
    ],
    level: 4
  },
  MECHANIC: {
    name: 'Mécanicien',
    description: 'Maintenance des véhicules',
    permissions: [
      'MAINTENANCE_VIEW', 'MAINTENANCE_CREATE_WO',
      'FLEET_VIEW'
    ],
    level: 4
  },
  MAINTENANCE_MANAGER: {
    name: 'Responsable Maintenance',
    description: 'Gestion de la maintenance',
    permissions: [
      'MAINTENANCE_VIEW', 'MAINTENANCE_CREATE_WO', 'MAINTENANCE_VALIDATE', 'MAINTENANCE_SCHEDULE',
      'FLEET_VIEW', 'FLEET_MANAGE',
      'REPORTS_VIEW'
    ],
    level: 2
  },
  FINANCE_MANAGER: {
    name: 'Responsable Finance',
    description: 'Gestion financière',
    permissions: [
      'FINANCE_VIEW', 'FINANCE_VALIDATE', 'FINANCE_INVOICE', 'FINANCE_REPORTS',
      'MISSION_VIEW',
      'REPORTS_VIEW', 'REPORTS_EXPORT'
    ],
    level: 2
  },
  SUPERVISOR: {
    name: 'Superviseur',
    description: 'Supervision des opérations',
    permissions: [
      'MISSION_VIEW', 'MISSION_VALIDATE',
      'FLEET_VIEW', 'FLEET_TELEMETRY',
      'MAINTENANCE_VIEW',
      'REPORTS_VIEW'
    ],
    level: 3
  },
  CLIENT_MANAGER: {
    name: 'Gestionnaire Client',
    description: 'Gestion des relations clients',
    permissions: [
      'CLIENT_VIEW', 'CLIENT_MANAGE',
      'MISSION_VIEW',
      'REPORTS_VIEW'
    ],
    level: 3
  }
}

// Workflow d'approbation
export interface ApprovalWorkflow {
  id: string
  name: string
  type: WorkflowType
  steps: ApprovalStep[]
  isActive: boolean
}

export type WorkflowType = 
  | 'MISSION_VALIDATION'
  | 'EXPENSE_VALIDATION'
  | 'MAINTENANCE_APPROVAL'
  | 'INVOICE_VALIDATION'

export interface ApprovalStep {
  id: string
  order: number
  name: string
  requiredRole: RoleCode
  isOptional: boolean
  conditions?: ApprovalCondition[]
}

export interface ApprovalCondition {
  field: string
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  value: any
}

// État d'une approbation
export interface ApprovalStatus {
  id: string
  workflowId: string
  entityId: string
  entityType: string
  currentStep: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  steps: StepStatus[]
  createdAt: Date
  updatedAt: Date
}

export interface StepStatus {
  stepId: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED'
  approver?: User
  comment?: string
  approvedAt?: Date
  signature?: string
} 