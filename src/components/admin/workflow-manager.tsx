'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-permissions'
import { ApprovalWorkflow, WorkflowType, RoleCode, PREDEFINED_ROLES } from '@/lib/types/auth'
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  User,
  Shield
} from 'lucide-react'

// Mock data pour les workflows
const mockWorkflows: ApprovalWorkflow[] = [
  {
    id: '1',
    name: 'Validation des frais de mission',
    type: 'EXPENSE_VALIDATION',
    isActive: true,
    steps: [
      {
        id: '1',
        order: 1,
        name: 'Validation superviseur',
        requiredRole: 'SUPERVISOR',
        isOptional: false,
        conditions: [{ field: 'amount', operator: 'gt', value: 100 }]
      },
      {
        id: '2',
        order: 2,
        name: 'Validation finance',
        requiredRole: 'FINANCE_MANAGER',
        isOptional: false,
        conditions: [{ field: 'amount', operator: 'gt', value: 500 }]
      }
    ]
  },
  {
    id: '2',
    name: 'Approbation maintenance majeure',
    type: 'MAINTENANCE_APPROVAL',
    isActive: true,
    steps: [
      {
        id: '3',
        order: 1,
        name: 'Validation technique',
        requiredRole: 'MAINTENANCE_MANAGER',
        isOptional: false
      },
      {
        id: '4',
        order: 2,
        name: 'Approbation budgétaire',
        requiredRole: 'FINANCE_MANAGER',
        isOptional: false,
        conditions: [{ field: 'cost', operator: 'gt', value: 1000 }]
      }
    ]
  }
]

export function WorkflowManager() {
  const { hasPermission } = useAuth()
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(mockWorkflows)

  if (!hasPermission('ADMIN_SYSTEM')) {
    return (
      <div className="text-center p-8">
        <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Accès non autorisé</p>
      </div>
    )
  }

  const getWorkflowTypeLabel = (type: WorkflowType) => {
    switch (type) {
      case 'MISSION_VALIDATION':
        return 'Validation Mission'
      case 'EXPENSE_VALIDATION':
        return 'Validation Frais'
      case 'MAINTENANCE_APPROVAL':
        return 'Approbation Maintenance'
      case 'INVOICE_VALIDATION':
        return 'Validation Facture'
      default:
        return type
    }
  }

  const getRoleLabel = (roleCode: RoleCode) => {
    return PREDEFINED_ROLES[roleCode]?.name || roleCode
  }

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === workflowId ? { ...w, isActive: !w.isActive } : w
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-card-foreground">Workflows d&apos;Approbation</h2>
          <p className="text-muted-foreground">
            Gestion des processus de validation et d&apos;approbation
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Workflow
        </Button>
      </div>

      {/* Workflows List */}
      <div className="grid gap-6">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="card-hover p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {workflow.name}
                  </h3>
                  <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                    {workflow.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Type: {getWorkflowTypeLabel(workflow.type)}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleWorkflowStatus(workflow.id)}
                  className={workflow.isActive ? 'text-orange-600' : 'text-green-600'}
                >
                  {workflow.isActive ? (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Désactiver
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Activer
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-card-foreground mb-3">
                Étapes d&apos;approbation ({workflow.steps.length})
              </h4>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                    <div className="gradient-border min-w-0">
                      <div className="bg-card p-3 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium text-primary">
                            {step.order}
                          </div>
                          <span className="text-sm font-medium text-card-foreground truncate">
                            {step.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {getRoleLabel(step.requiredRole)}
                          </span>
                        </div>
                        
                        {step.conditions && step.conditions.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {step.conditions.length} condition(s)
                          </div>
                        )}
                        
                        {step.isOptional && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Optionnel
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {index < workflow.steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Stats */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-card-foreground">24</div>
                  <div className="text-xs text-muted-foreground">En attente</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">156</div>
                  <div className="text-xs text-muted-foreground">Approuvés</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">8</div>
                  <div className="text-xs text-muted-foreground">Rejetés</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Configuration avancée */}
      <Card className="card-hover p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration Avancée
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-card-foreground">Paramètres généraux</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-card-foreground">Notifications automatiques</span>
                <div className="w-10 h-6 rounded-full bg-primary">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 translate-x-5"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-card-foreground">Escalade automatique</span>
                <div className="w-10 h-6 rounded-full bg-muted">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 translate-x-1"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-card-foreground">Signature électronique</span>
                <div className="w-10 h-6 rounded-full bg-primary">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 translate-x-5"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-card-foreground">Délais d&apos;approbation</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-card-foreground">Délai standard</span>
                <span className="text-sm font-medium text-card-foreground">48h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-card-foreground">Délai urgent</span>
                <span className="text-sm font-medium text-card-foreground">24h</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-card-foreground">Escalade après</span>
                <span className="text-sm font-medium text-card-foreground">72h</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 