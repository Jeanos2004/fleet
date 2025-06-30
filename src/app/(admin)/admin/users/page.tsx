'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { ModalForm } from '@/components/crud/modal-form'
import { DataTable } from '@/components/crud/data-table'
import { useDemoAuth } from '@/components/providers/demo-auth-provider'
import { 
  Plus, 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Search,
  Download,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Calendar
} from 'lucide-react'

// Types pour les utilisateurs
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'TRANSPORT_MANAGER' | 'DRIVER' | 'TECHNICIAN' | 'FINANCE'
  isActive: boolean
  lastLogin: Date
  createdAt: Date
  phone?: string
  department?: string
}

// Données mockées
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@fleetmanager.com',
    firstName: 'Jean',
    lastName: 'Administrateur',
    role: 'ADMIN',
    isActive: true,
    lastLogin: new Date('2024-03-15T09:30:00'),
    createdAt: new Date('2024-01-01'),
    phone: '+33 1 23 45 67 89',
    department: 'Direction'
  },
  {
    id: '2',
    email: 'marie.transport@fleetmanager.com',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: 'TRANSPORT_MANAGER',
    isActive: true,
    lastLogin: new Date('2024-03-15T08:15:00'),
    createdAt: new Date('2024-01-15'),
    phone: '+33 1 23 45 67 90',
    department: 'Transport'
  },
  {
    id: '3',
    email: 'jean.chauffeur@fleetmanager.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'DRIVER',
    isActive: true,
    lastLogin: new Date('2024-03-14T17:45:00'),
    createdAt: new Date('2024-02-01'),
    phone: '+33 1 23 45 67 91',
    department: 'Opérations'
  },
  {
    id: '4',
    email: 'pierre.tech@fleetmanager.com',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: 'TECHNICIAN',
    isActive: false,
    lastLogin: new Date('2024-03-13T14:20:00'),
    createdAt: new Date('2024-02-15'),
    phone: '+33 1 23 45 67 92',
    department: 'Maintenance'
  },
  {
    id: '5',
    email: 'sophie.finance@fleetmanager.com',
    firstName: 'Sophie',
    lastName: 'Leroy',
    role: 'FINANCE',
    isActive: true,
    lastLogin: new Date('2024-03-12T11:30:00'),
    createdAt: new Date('2024-02-20'),
    phone: '+33 1 23 45 67 93',
    department: 'Finance'
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

export default function AdminUsersPage() {
  const { user: currentUser, hasPermission } = useDemoAuth()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Vérifier les permissions
  if (!currentUser || !hasPermission('admin', 'read')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    )
  }

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Statistiques
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    inactive: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'ADMIN').length
  }

  // Configuration des colonnes pour le tableau
  const columns = [
    {
      key: 'user',
      label: 'Utilisateur',
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.isActive ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
            <Users className={`h-5 w-5 ${user.isActive ? 'text-green-500' : 'text-gray-500'}`} />
          </div>
          <div>
            <div className="font-semibold text-card-foreground">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rôle',
      render: (user: User) => (
        <Badge className={`${roleColors[user.role]} border-0`}>
          {roleLabels[user.role]}
        </Badge>
      )
    },
    {
      key: 'department',
      label: 'Département',
      render: (user: User) => (
        <span className="text-sm text-muted-foreground">{user.department || '-'}</span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (user: User) => (
        <Badge variant={user.isActive ? 'default' : 'secondary'} className="flex items-center gap-1">
          {user.isActive ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
          {user.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      )
    },
    {
      key: 'lastLogin',
      label: 'Dernière connexion',
      render: (user: User) => (
        <div className="text-sm">
          <div>{user.lastLogin.toLocaleDateString('fr-FR')}</div>
          <div className="text-xs text-muted-foreground">
            {user.lastLogin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (user: User) => (
        <div className="text-sm">
          {user.phone && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      )
    }
  ]

  // Configuration du formulaire
  const formFields = [
    {
      name: 'firstName',
      label: 'Prénom',
      type: 'text' as const,
      required: true,
      placeholder: 'Jean'
    },
    {
      name: 'lastName',
      label: 'Nom',
      type: 'text' as const,
      required: true,
      placeholder: 'Dupont'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email' as const,
      required: true,
      placeholder: 'jean.dupont@fleetmanager.com'
    },
    {
      name: 'phone',
      label: 'Téléphone',
      type: 'tel' as const,
      placeholder: '+33 1 23 45 67 89'
    },
    {
      name: 'role',
      label: 'Rôle',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'ADMIN', label: 'Administrateur' },
        { value: 'TRANSPORT_MANAGER', label: 'Responsable Transport' },
        { value: 'DRIVER', label: 'Chauffeur' },
        { value: 'TECHNICIAN', label: 'Technicien' },
        { value: 'FINANCE', label: 'Finance' }
      ]
    },
    {
      name: 'department',
      label: 'Département',
      type: 'text' as const,
      placeholder: 'Transport, Maintenance, Finance...'
    },
    {
      name: 'isActive',
      label: 'Compte actif',
      type: 'checkbox' as const
    }
  ]

  // Actions CRUD
  const handleCreate = (data: any) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      ...data,
      lastLogin: new Date(),
      createdAt: new Date()
    }
    setUsers([...users, newUser])
    setIsFormOpen(false)
    toast({
      title: "Utilisateur créé",
      description: `${data.firstName} ${data.lastName} a été ajouté avec succès.`
    })
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleUpdate = (data: any) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u))
      setIsFormOpen(false)
      setEditingUser(null)
      toast({
        title: "Utilisateur modifié",
        description: `${data.firstName} ${data.lastName} a été mis à jour.`
      })
    }
  }

  const handleDelete = (user: User) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      setUsers(users.filter(u => u.id !== user.id))
      toast({
        title: "Utilisateur supprimé",
        description: `${user.firstName} ${user.lastName} a été supprimé.`,
        variant: "destructive"
      })
    }
  }

  const handleView = (user: User) => {
    toast({
      title: "Voir l'utilisateur",
      description: `Ouverture des détails de ${user.firstName} ${user.lastName}`
    })
  }

  const toggleUserStatus = (user: User) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, isActive: !u.isActive }
        : u
    ))
    toast({
      title: user.isActive ? "Utilisateur désactivé" : "Utilisateur activé",
      description: `${user.firstName} ${user.lastName} a été ${user.isActive ? 'désactivé' : 'activé'}.`
    })
  }

  const actions = [
    {
      label: 'Voir',
      icon: Eye,
      onClick: handleView,
      variant: 'ghost' as const
    },
    {
      label: 'Modifier',
      icon: Edit,
      onClick: handleEdit,
      variant: 'ghost' as const
    },
    {
      label: 'Activer/Désactiver',
      icon: UserCheck,
      onClick: toggleUserStatus,
      variant: 'ghost' as const
    },
    {
      label: 'Supprimer',
      icon: Trash2,
      onClick: handleDelete,
      variant: 'ghost' as const,
      className: 'text-red-600 hover:text-red-700'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border pb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-muted-foreground mt-2">
                Gérez les comptes utilisateurs et leurs permissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Nouvel Utilisateur
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactifs</p>
                <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </motion.div>

        {/* Filtres et recherche */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-80 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            >
              <option value="all">Tous les rôles</option>
              <option value="ADMIN">Administrateur</option>
              <option value="TRANSPORT_MANAGER">Resp. Transport</option>
              <option value="DRIVER">Chauffeur</option>
              <option value="TECHNICIAN">Technicien</option>
              <option value="FINANCE">Finance</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>

          <div className="text-sm text-muted-foreground">
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </div>
        </motion.div>

        {/* Tableau des utilisateurs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable
            data={filteredUsers}
            columns={columns}
            actions={actions}
            emptyMessage="Aucun utilisateur trouvé"
          />
        </motion.div>

        {/* Modal formulaire */}
        <ModalForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingUser(null)
          }}
          title={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          fields={formFields}
          onSubmit={editingUser ? handleUpdate : handleCreate}
          initialData={editingUser || undefined}
        />
      </div>
    </div>
  )
}