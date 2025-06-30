import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware désactivé temporairement pour la démo
// L'authentification est gérée par le DemoAuthProvider
export function middleware(_request: NextRequest) {
  // Laisser passer toutes les requêtes en mode démo
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Désactivé temporairement
    // '/dashboard/:path*',
    // '/missions/:path*',
    // '/fleet/:path*',
    // '/telemetry/:path*',
    // '/maintenance/:path*',
    // '/reports/:path*',
    // '/notifications/:path*',
    // '/admin/:path*'
  ]
} 