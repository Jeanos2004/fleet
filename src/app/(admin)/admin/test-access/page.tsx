'use client'

import { useDemoAuth } from '@/components/providers/demo-auth-provider'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, CheckCircle, Users, Settings, FileText } from 'lucide-react'

export default function AdminTestPage() {
  const { user, hasPermission, isAdmin, switchUser, demoUsers } = useDemoAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Non authentifié</h2>
          <p className="text-muted-foreground">Veuillez vous connecter.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Test d'Accès Admin
        </h1>
        <p className="text-muted-foreground mt-2">
          Page de test pour vérifier l'authentification et les permissions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informations utilisateur */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Utilisateur Actuel
          </h2>
          
          <div className="space-y-3">
            <div>
              <strong>Nom:</strong> {user.firstName} {user.lastName}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div>
              <strong>Rôle:</strong> 
              <Badge className="ml-2">
                {user.role}
              </Badge>
            </div>
            <div>
              <strong>Admin:</strong> 
              {isAdmin ? (
                <Badge className="ml-2 bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Oui
                </Badge>
              ) : (
                <Badge variant="secondary" className="ml-2">
                  Non
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Test des permissions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Permissions
          </h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Admin (lecture):</span>
              {hasPermission('admin', 'read') ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Autorisé
                </Badge>
              ) : (
                <Badge variant="destructive">Refusé</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span>Dashboard:</span>
              {hasPermission('dashboard', 'read') ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Autorisé
                </Badge>
              ) : (
                <Badge variant="destructive">Refusé</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span>Véhicules:</span>
              {hasPermission('vehicles', 'read') ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Autorisé
                </Badge>
              ) : (
                <Badge variant="destructive">Refusé</Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Changement d'utilisateur */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Changer d'Utilisateur (Démo)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {demoUsers.map((demoUser) => (
              <Button
                key={demoUser.id}
                variant={demoUser.id === user.id ? "default" : "outline"}
                className="justify-start h-auto p-3"
                onClick={() => switchUser(demoUser.id)}
                disabled={demoUser.id === user.id}
              >
                <div className="text-left">
                  <div className="font-medium">
                    {demoUser.firstName} {demoUser.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {demoUser.role}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </Card>

        {/* Test des routes */}
        <Card className="p-6 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test d'Accès aux Routes
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { path: '/admin/users', label: 'Utilisateurs' },
              { path: '/admin/audit', label: 'Audit' },
              { path: '/admin/settings', label: 'Paramètres' },
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/vehicles', label: 'Véhicules' },
              { path: '/missions', label: 'Missions' },
              { path: '/reports', label: 'Rapports' },
              { path: '/maintenance', label: 'Maintenance' }
            ].map((route) => (
              <Button
                key={route.path}
                variant="outline"
                size="sm"
                asChild
                className="h-auto p-2"
              >
                <a href={route.path} className="text-center">
                  <div className="text-xs">{route.label}</div>
                </a>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}