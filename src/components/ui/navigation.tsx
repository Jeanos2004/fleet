'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserMenu } from '@/components/layout/user-menu'
import { 
  LayoutDashboard, 
  Truck, 
  MapPin, 
  Wrench, 
  FileText, 
  Settings,
  Bell,
  Activity
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Missions', href: '/missions', icon: MapPin },
  { name: 'Flotte', href: '/fleet', icon: Truck },
  { name: 'Télémétrie', href: '/telemetry', icon: Activity },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Rapports', href: '/reports', icon: FileText },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Administration', href: '/admin', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-r border-border h-full flex flex-col shadow-sm">
      {/* Logo simplifié */}
      <div className="flex items-center px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center">
          <div className="p-2 bg-primary rounded-lg">
            <Truck className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="ml-3 text-xl font-bold text-card-foreground">Fleet</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* User section */}
      <div className="border-t border-border px-4 py-4">
        <UserMenu />
      </div>
    </nav>
  )
} 