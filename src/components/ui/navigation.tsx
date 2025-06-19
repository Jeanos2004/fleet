'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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
  Activity,
  ChevronDown,
  ChevronRight,
  List,
  UserCheck,
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  PieChart
} from 'lucide-react'

interface NavigationItem {
  name: string
  href?: string
  icon: any
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard 
  },
  {
    name: 'Véhicules',
    icon: Truck,
    children: [
      { name: 'Liste des véhicules', href: '/vehicles', icon: List },
      { name: 'Assignations', href: '/vehicles/assignments', icon: UserCheck },
      { name: 'Historique kilométrage', href: '/vehicles/mileage', icon: BarChart3 },
      { name: 'Historique des coûts', href: '/vehicles/expenses', icon: DollarSign },
      { name: 'Analyse de remplacement', href: '/vehicles/replacement', icon: TrendingUp }
    ]
  },
  {
    name: 'Missions',
    icon: MapPin,
    children: [
      { name: 'Toutes les missions', href: '/missions', icon: List },
      { name: 'Planification', href: '/missions/planning', icon: Calendar },
      { name: 'Suivi en temps réel', href: '/missions/tracking', icon: Activity }
    ]
  },
  {
    name: 'Personnel',
    icon: Users,
    children: [
      { name: 'Chauffeurs', href: '/drivers', icon: Users },
      { name: 'Plannings', href: '/drivers/schedules', icon: Calendar },
      { name: 'Évaluations', href: '/drivers/reviews', icon: BarChart3 }
    ]
  },
  {
    name: 'Maintenance',
    icon: Wrench,
    children: [
      { name: 'Interventions', href: '/maintenance', icon: Wrench },
      { name: 'Maintenance préventive', href: '/maintenance/preventive', icon: Calendar },
      { name: 'Historique', href: '/maintenance/history', icon: List },
      { name: 'Pièces détachées', href: '/maintenance/parts', icon: Settings }
    ]
  },
  {
    name: 'Rapports',
    icon: FileText,
    children: [
      { name: 'Tableau de bord', href: '/reports', icon: PieChart },
      { name: 'Rapports financiers', href: '/reports/financial', icon: DollarSign },
      { name: 'Rapports opérationnels', href: '/reports/operational', icon: BarChart3 },
      { name: 'Exports', href: '/reports/exports', icon: FileText }
    ]
  },
  { 
    name: 'Télémétrie', 
    href: '/telemetry', 
    icon: Activity 
  },
  { 
    name: 'Notifications', 
    href: '/notifications', 
    icon: Bell 
  },
  {
    name: 'Administration',
    icon: Settings,
    children: [
      { name: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
      { name: 'Utilisateurs', href: '/admin/users', icon: Users },
      { name: 'Logs d\'audit', href: '/admin/audit', icon: FileText },
      { name: 'Paramètres', href: '/admin/settings', icon: Settings }
    ]
  }
]

export function Navigation() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set())

  const toggleMenu = (menuName: string) => {
    const newOpenMenus = new Set(openMenus)
    if (newOpenMenus.has(menuName)) {
      newOpenMenus.delete(menuName)
    } else {
      newOpenMenus.add(menuName)
    }
    setOpenMenus(newOpenMenus)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const isParentActive = (item: NavigationItem): boolean => {
    if (item.href && isActive(item.href)) return true
    if (item.children) {
      return item.children.some(child => child.href && isActive(child.href))
    }
    return false
  }

  const renderNavigationItem = (item: NavigationItem) => {
    const hasChildren = item.children && item.children.length > 0
    const isMenuOpen = openMenus.has(item.name)
    const itemIsActive = isParentActive(item)

    if (hasChildren) {
      return (
        <li key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={cn(
              'group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
              itemIsActive
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <div className="flex items-center">
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  itemIsActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
                )}
              />
              {item.name}
            </div>
            {isMenuOpen ? (
              <ChevronDown className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform" />
            )}
          </button>

          {/* Sous-menu déroulant */}
          <div 
            className={cn(
              'overflow-hidden transition-all duration-300 ease-in-out',
              isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <ul className="ml-4 mt-2 space-y-1 border-l border-border pl-4">
              {item.children?.map((child) => (
                <li key={child.name}>
                  <Link
                    href={child.href || '#'}
                    className={cn(
                      'group flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200',
                      child.href && isActive(child.href)
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <child.icon
                      className={cn(
                        'mr-3 h-4 w-4 flex-shrink-0 transition-colors',
                        child.href && isActive(child.href) 
                          ? 'text-primary-foreground' 
                          : 'text-muted-foreground group-hover:text-accent-foreground'
                      )}
                    />
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      )
    }

    // Item simple sans enfants
    return (
      <li key={item.name}>
        <Link
          href={item.href || '#'}
          className={cn(
            'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
            item.href && isActive(item.href)
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <item.icon
            className={cn(
              'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
              item.href && isActive(item.href) 
                ? 'text-primary-foreground' 
                : 'text-muted-foreground group-hover:text-accent-foreground'
            )}
          />
          {item.name}
        </Link>
      </li>
    )
  }

  return (
    <nav className="bg-card border-r border-border h-full flex flex-col shadow-sm">
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center">
          <div className="p-2 bg-primary rounded-lg shadow-sm">
            <Truck className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="ml-3 text-xl font-bold text-card-foreground">FleetManager</span>
        </div>
      </div>

      {/* Navigation avec sous-menus */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map(renderNavigationItem)}
        </ul>
      </div>

      {/* User section */}
      <div className="border-t border-border px-4 py-4">
        <UserMenu />
      </div>
    </nav>
  )
} 