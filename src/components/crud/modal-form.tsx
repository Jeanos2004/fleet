'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Save, AlertCircle } from 'lucide-react'

interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'date' | 'time'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: (value: any) => string | null
  min?: number
  max?: number
  step?: number
}

interface ModalFormProps {
  isOpen: boolean
  onClose: () => void
  title: string
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void
  initialData?: Record<string, any>
  submitLabel?: string
  cancelLabel?: string
  isLoading?: boolean
}

export function ModalForm({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  initialData = {},
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  isLoading = false
}: ModalFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData)
      setErrors({})
      setTouched({})
    }
  }, [isOpen, initialData])

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value === '')) {
      return `${field.label} est requis`
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return 'Format d\'email invalide'
      }
    }

    if (field.type === 'tel' && value) {
      const phoneRegex = /^(\+33|0)[1-9](\d{8})$/
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return 'Format de téléphone invalide'
      }
    }

    if (field.type === 'number' && value !== undefined && value !== '') {
      const numValue = parseFloat(value)
      if (isNaN(numValue)) {
        return 'Doit être un nombre'
      }
      if (field.min !== undefined && numValue < field.min) {
        return `Doit être supérieur ou égal à ${field.min}`
      }
      if (field.max !== undefined && numValue > field.max) {
        return `Doit être inférieur ou égal à ${field.max}`
      }
    }

    if (field.validation) {
      return field.validation(value)
    }

    return null
  }

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
    
    // Validation en temps réel
    const field = fields.find(f => f.name === fieldName)
    if (field && touched[fieldName]) {
      const error = validateField(field, value)
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }))
    }
  }

  const handleFieldBlur = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    
    const field = fields.find(f => f.name === fieldName)
    if (field) {
      const error = validateField(field, formData[fieldName])
      setErrors(prev => ({
        ...prev,
        [fieldName]: error || ''
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation complète
    const newErrors: Record<string, string> = {}
    let hasErrors = false

    fields.forEach(field => {
      const error = validateField(field, formData[field.name])
      if (error) {
        newErrors[field.name] = error
        hasErrors = true
      }
    })

    setErrors(newErrors)
    setTouched(Object.fromEntries(fields.map(f => [f.name, true])))

    if (!hasErrors) {
      onSubmit(formData)
    }
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''
    const error = errors[field.name]
    const hasError = touched[field.name] && error

    const baseInputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors ${
      hasError 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-border focus:border-primary'
    } bg-background`

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              rows={3}
              className={baseInputClasses}
            />
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              className={baseInputClasses}
            >
              <option value="">{field.placeholder || `Sélectionner ${field.label.toLowerCase()}`}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={value || false}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                onBlur={() => handleFieldBlur(field.name)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
              />
              <span className="text-sm font-medium text-foreground">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        )

      default:
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              onBlur={() => handleFieldBlur(field.name)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
              className={baseInputClasses}
            />
            {hasError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                  {fields.map(renderField)}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/25">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {submitLabel}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
