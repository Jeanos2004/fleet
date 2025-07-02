'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { List, Grid } from 'lucide-react'

export type ViewMode = 'list' | 'card'

interface ViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export function ViewToggle({ 
  viewMode, 
  onViewModeChange, 
  className = ''
}: ViewToggleProps) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-muted/50 rounded-lg ${className}`}>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="h-8 px-3"
        title="Vue en liste"
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('card')}
        className="h-8 px-3"
        title="Vue en cartes"
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Hook personnalisé pour gérer le mode d'affichage
export function useViewMode(defaultMode: ViewMode = 'card') {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode)
  
  return {
    viewMode,
    setViewMode,
    isListView: viewMode === 'list',
    isCardView: viewMode === 'card'
  }
}

// Composant générique pour les éléments de liste
interface ListItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function ListItem({ children, className = '', onClick }: ListItemProps) {
  return (
    <div 
      className={`
        flex items-center justify-between p-4 bg-background border border-border rounded-lg
        hover:bg-muted/50 transition-all duration-200 cursor-pointer
        dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700/50
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Composant générique pour les cartes
interface CardItemProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function CardItem({ children, className = '', onClick }: CardItemProps) {
  return (
    <div 
      className={`
        p-6 bg-background border border-border rounded-xl
        hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer
        dark:bg-slate-800 dark:border-slate-700 dark:hover:border-blue-500/30
        dark:hover:shadow-blue-500/10
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Composant container adaptatif
interface AdaptiveContainerProps {
  viewMode: ViewMode
  children: React.ReactNode
  className?: string
}

export function AdaptiveContainer({ viewMode, children, className = '' }: AdaptiveContainerProps) {
  const getGridClasses = () => {
    switch (viewMode) {
      case 'list':
        return 'space-y-3'
      case 'card':
        return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
    }
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  )
} 