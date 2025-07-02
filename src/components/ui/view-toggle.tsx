'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Grid3X3, List, LayoutGrid } from 'lucide-react'

export type ViewMode = 'list' | 'card'

interface ViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

export function ViewToggle({ viewMode, onViewModeChange, className = '' }: ViewToggleProps) {
  return (
    <div className={`flex items-center gap-1 p-1 bg-muted rounded-lg ${className}`}>
      <Button
        variant={viewMode === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('card')}
        className={`h-8 px-3 ${
          viewMode === 'card' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        }`}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        Cartes
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className={`h-8 px-3 ${
          viewMode === 'list' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        }`}
      >
        <List className="h-4 w-4 mr-1" />
        Liste
      </Button>
    </div>
  )
}

// Hook personnalisé pour gérer l'état du view mode
export function useViewMode(defaultMode: ViewMode = 'card') {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode)
  
  return {
    viewMode,
    setViewMode,
    isCardView: viewMode === 'card',
    isListView: viewMode === 'list'
  }
} 