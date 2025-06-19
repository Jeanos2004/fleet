import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuditLogs } from '@/components/admin/audit-logs'
import { mockMarketeurs, mockSites } from '@/lib/db/mock-data'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Plus, Users, Building, Settings, Shield, Edit, Trash2, Eye, FileText, UserCheck } from 'lucide-react'

// Données mockées pour les utilisateurs
const mockUsers = [
  {
    id: '1',
    email: 'admin@fleetmanager.com',
    name: 'Administrateur Principal',
    role: 'ADMIN',
    lastLogin: new Date('2024-03-15T09:30:00'),
    active: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    email: 'transport@fleetmanager.com',
    name: 'Marie Dubois',
    role: 'TRANSPORT_MANAGER',
    lastLogin: new Date('2024-03-15T08:15:00'),
    active: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    email: 'chauffeur1@fleetmanager.com',
    name: 'Jean Dupont',
    role: 'DRIVER',
    lastLogin: new Date('2024-03-14T17:45:00'),
    active: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    email: 'tech@fleetmanager.com',
    name: 'Pierre Martin',
    role: 'TECHNICIAN',
    lastLogin: new Date('2024-03-13T14:20:00'),
    active: false,
    createdAt: new Date('2024-02-15')
  }
]

const roleLabels = {
  ADMIN: 'Administrateur',
  TRANSPORT_MANAGER: 'Resp. Transport',
  DRIVER: 'Chauffeur',
  TECHNICIAN: 'Technicien',
  FINANCE: 'Finance'
}

const roleColors = {
  ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  TRANSPORT_MANAGER: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  DRIVER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  TECHNICIAN: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  FINANCE: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
}

export default function AdminPage() {
  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter(u => u.active).length
  const totalMarketeurs = mockMarketeurs.length
  const marketeursAvecContrat = mockMarketeurs.filter(m => m.contractSigne).length

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Administration</h1>
              <p className="text-muted-foreground mt-2">
                Gestion des utilisateurs, marketeurs et configuration système
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{activeUsers}/{totalUsers} utilisateurs actifs</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2 input-styled">
                  <Settings className="h-4 w-4" />
                  Configuration
                </Button>
                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Nouvel Utilisateur
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <UserCheck className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateurs actifs</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{activeUsers}</span>
                    <span className="text-sm text-muted-foreground">sur {totalUsers}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Comptes utilisateurs</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Building className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Marketeurs</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{totalMarketeurs}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{marketeursAvecContrat} avec contrat</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                  <Building className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sites actifs</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-2xl font-bold text-card-foreground">{mockSites.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Sites de livraison</p>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sécurité</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-green-600">Sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Dernière vérif. OK</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gestion des utilisateurs */}
          <div className="card-hover rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <Users className="h-5 w-5" />
                Utilisateurs
              </h2>
              <Button size="sm" className="bg-primary hover:bg-primary/90 flex items-center gap-1">
                <Plus className="h-3 w-3" />
                Ajouter
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockUsers.map((user) => (
                <div key={user.id} className="gradient-border">
                  <div className="p-4 bg-card rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.active ? 'bg-green-500/10' : 'bg-muted'}`}>
                            <Users className={`h-4 w-4 ${user.active ? 'text-green-500' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-card-foreground">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`text-xs ${roleColors[user.role as keyof typeof roleColors]}`}>
                            {roleLabels[user.role as keyof typeof roleLabels]}
                          </Badge>
                          <Badge variant={user.active ? 'default' : 'secondary'}>
                            {user.active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Dernière connexion: {formatDate(user.lastLogin)}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-4">
                        <Button variant="outline" size="sm" className="input-styled">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="input-styled">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="input-styled text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="card-hover rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Logs d'audit
              </h2>
              <Button variant="outline" size="sm">Exporter</Button>
            </div>
            
            <AuditLogs />
          </div>
        </div>
      </div>
    </div>
  )
} 