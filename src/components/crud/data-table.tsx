'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface Action<T> {
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: (item: T) => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  actions?: Action<T>[]
  emptyMessage?: string
  searchable?: boolean
  sortable?: boolean
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  emptyMessage = "Aucune donnée trouvée",
  searchable = false,
  sortable = false
}: DataTableProps<T>) {
  
  const renderCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      return column.render(item)
    }
    
    const value = item[column.key]
    
    // Gestion automatique des types courants
    if (value instanceof Date) {
      return value.toLocaleDateString('fr-FR')
    }
    
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Oui' : 'Non'}
        </Badge>
      )
    }
    
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    
    return value?.toString() || '-'
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="text-left p-4 font-medium text-muted-foreground"
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-right p-4 font-medium text-muted-foreground">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr 
                key={item.id || index} 
                className="border-t border-border hover:bg-muted/25 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="p-4">
                    {renderCellValue(item, column)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      {actions.map((action, actionIndex) => {
                        const IconComponent = action.icon
                        return (
                          <Button
                            key={actionIndex}
                            variant={action.variant || 'ghost'}
                            size="sm"
                            onClick={() => action.onClick(item)}
                            className={action.className}
                            title={action.label}
                          >
                            <IconComponent className="h-4 w-4" />
                          </Button>
                        )
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">
            📋
          </div>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  )
}
