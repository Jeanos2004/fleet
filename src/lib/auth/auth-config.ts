import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'TRANSPORT_MANAGER' | 'DRIVER' | 'TECHNICIAN' | 'FINANCE'
  avatar?: string
  permissions: string[]
}

// Utilisateurs mockés pour la démo
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@fleetmanager.com',
    name: 'Administrateur Principal',
    role: 'ADMIN',
    permissions: ['*'] // Toutes permissions
  },
  {
    id: '2',
    email: 'transport@fleetmanager.com',
    name: 'Marie Dubois',
    role: 'TRANSPORT_MANAGER',
    permissions: [
      'missions:read',
      'missions:write',
      'fleet:read',
      'telemetry:read',
      'reports:read'
    ]
  },
  {
    id: '3',
    email: 'chauffeur1@fleetmanager.com',
    name: 'Jean Dupont',
    role: 'DRIVER',
    permissions: [
      'missions:read',
      'telemetry:read'
    ]
  },
  {
    id: '4',
    email: 'tech@fleetmanager.com',
    name: 'Pierre Martin',
    role: 'TECHNICIAN',
    permissions: [
      'maintenance:read',
      'maintenance:write',
      'fleet:read'
    ]
  },
  {
    id: '5',
    email: 'finance@fleetmanager.com',
    name: 'Sophie Leroy',
    role: 'FINANCE',
    permissions: [
      'reports:read',
      'reports:write',
      'missions:read'
    ]
  }
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Simulation de vérification de mot de passe
        // En production, vérifier contre une vraie base de données
        const user = mockUsers.find(u => u.email === credentials.email)
        
        if (user && credentials.password === 'demo123') {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions
          }
        }

        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role
        token.permissions = (user as User).permissions
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as User & { id: string }).id = token.sub || ''
        ;(session.user as User & { role: string }).role = token.role as "ADMIN" | "TRANSPORT_MANAGER" | "DRIVER" | "TECHNICIAN" | "FINANCE";
        ;(session.user as User & { permissions: string[] }).permissions = token.permissions as string[]
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 heures
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-key'
}

// Utilitaires pour la gestion des permissions
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  if (userPermissions.includes('*')) return true
  return userPermissions.includes(requiredPermission)
}

export const canAccessRoute = (userRole: string, route: string): boolean => {
  const routePermissions: Record<string, string[]> = {
    '/dashboard': ['ADMIN', 'TRANSPORT_MANAGER', 'DRIVER', 'TECHNICIAN', 'FINANCE'],
    '/missions': ['ADMIN', 'TRANSPORT_MANAGER', 'DRIVER'],
    '/fleet': ['ADMIN', 'TRANSPORT_MANAGER', 'TECHNICIAN'],
    '/telemetry': ['ADMIN', 'TRANSPORT_MANAGER', 'DRIVER'],
    '/maintenance': ['ADMIN', 'TECHNICIAN', 'TRANSPORT_MANAGER'],
    '/reports': ['ADMIN', 'TRANSPORT_MANAGER', 'FINANCE'],
    '/notifications': ['ADMIN', 'TRANSPORT_MANAGER', 'DRIVER', 'TECHNICIAN', 'FINANCE'],
    '/admin': ['ADMIN']
  }

  return routePermissions[route]?.includes(userRole) || false
} 