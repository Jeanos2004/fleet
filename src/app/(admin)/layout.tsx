import type { Metadata } from 'next'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Navigation } from '@/components/ui/navigation'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'Fleet Management Admin',
  description: 'Interface d\'administration pour la gestion de flotte',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen bg-background">
        <div className="w-64 flex-shrink-0">
          <Navigation />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
