import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { canAccessRoute } from '@/lib/auth/auth-config'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Si pas de token et tentative d'accès à une route protégée
    if (!token && pathname !== '/auth/signin') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Vérifier les permissions de rôle
    if (token && token.role) {
      const hasAccess = canAccessRoute(token.role as string, pathname)
      
      if (!hasAccess) {
        // Rediriger vers une page d'erreur ou le dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permettre l'accès à la page de connexion sans token
        if (req.nextUrl.pathname === '/auth/signin') {
          return true
        }
        
        // Exiger un token pour toutes les autres routes protégées
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/missions/:path*',
    '/fleet/:path*',
    '/telemetry/:path*',
    '/maintenance/:path*',
    '/reports/:path*',
    '/notifications/:path*',
    '/admin/:path*'
  ]
} 