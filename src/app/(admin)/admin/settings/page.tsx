"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Settings, Shield, Database, Bell, Globe, Users, Truck, Save } from 'lucide-react'

interface SettingCategory {
  id: string
  name: string
  icon: any
  description: string
  settings: Setting[]
}

interface Setting {
  id: string
  name: string
  description: string
  type: 'toggle' | 'select' | 'input' | 'number'
  value: any
  options?: string[]
  unit?: string
}

const mockSettings: SettingCategory[] = [
  {
    id: 'general',
    name: 'Paramètres généraux',
    icon: Settings,
    description: 'Configuration générale de l\'application',
    settings: [
      {
        id: 'company_name',
        name: 'Nom de l\'entreprise',
        description: 'Nom affiché dans l\'application',
        type: 'input',
        value: 'Transport & Logistique Pro'
      },
      {
        id: 'timezone',
        name: 'Fuseau horaire',
        description: 'Fuseau horaire par défaut',
        type: 'select',
        value: 'Europe/Paris',
        options: ['Europe/Paris', 'Europe/London', 'America/New_York', 'Asia/Tokyo']
      },
      {
        id: 'currency',
        name: 'Devise',
        description: 'Devise utilisée pour les calculs',
        type: 'select',
        value: 'EUR',
        options: ['EUR', 'USD', 'GBP', 'CHF']
      },
      {
        id: 'language',
        name: 'Langue par défaut',
        description: 'Langue de l\'interface utilisateur',
        type: 'select',
        value: 'fr',
        options: ['fr', 'en', 'es', 'de']
      }
    ]
  },
  {
    id: 'fleet',
    name: 'Gestion de flotte',
    icon: Truck,
    description: 'Paramètres liés aux véhicules et missions',
    settings: [
      {
        id: 'auto_assign_missions',
        name: 'Attribution automatique des missions',
        description: 'Assigner automatiquement les missions aux chauffeurs disponibles',
        type: 'toggle',
        value: true
      },
      {
        id: 'fuel_alert_threshold',
        name: 'Seuil d\'alerte carburant',
        description: 'Niveau de carburant déclenchant une alerte',
        type: 'number',
        value: 20,
        unit: '%'
      },
      {
        id: 'maintenance_reminder',
        name: 'Rappels de maintenance',
        description: 'Délai de rappel avant échéance de maintenance',
        type: 'number',
        value: 7,
        unit: 'jours'
      },
      {
        id: 'max_driving_hours',
        name: 'Heures de conduite max/jour',
        description: 'Limite réglementaire d\'heures de conduite',
        type: 'number',
        value: 9,
        unit: 'heures'
      }
    ]
  },
  {
    id: 'users',
    name: 'Utilisateurs & Accès',
    icon: Users,
    description: 'Gestion des utilisateurs et permissions',
    settings: [
      {
        id: 'password_policy',
        name: 'Politique de mot de passe stricte',
        description: 'Appliquer des règles strictes pour les mots de passe',
        type: 'toggle',
        value: true
      },
      {
        id: 'session_timeout',
        name: 'Timeout de session',
        description: 'Durée avant déconnexion automatique',
        type: 'number',
        value: 8,
        unit: 'heures'
      },
      {
        id: 'two_factor_auth',
        name: 'Authentification à double facteur',
        description: 'Activer 2FA pour tous les utilisateurs',
        type: 'toggle',
        value: false
      },
      {
        id: 'default_role',
        name: 'Rôle par défaut',
        description: 'Rôle attribué aux nouveaux utilisateurs',
        type: 'select',
        value: 'driver',
        options: ['admin', 'transport_manager', 'driver', 'technician', 'finance']
      }
    ]
  },
  {
    id: 'security',
    name: 'Sécurité',
    icon: Shield,
    description: 'Paramètres de sécurité et conformité',
    settings: [
      {
        id: 'audit_logging',
        name: 'Journalisation des audits',
        description: 'Enregistrer toutes les actions utilisateurs',
        type: 'toggle',
        value: true
      },
      {
        id: 'data_retention',
        name: 'Rétention des données',
        description: 'Durée de conservation des logs',
        type: 'number',
        value: 12,
        unit: 'mois'
      },
      {
        id: 'encryption_level',
        name: 'Niveau de chiffrement',
        description: 'Force du chiffrement des données',
        type: 'select',
        value: 'AES-256',
        options: ['AES-128', 'AES-256', 'AES-512']
      },
      {
        id: 'backup_frequency',
        name: 'Fréquence des sauvegardes',
        description: 'Intervalle entre les sauvegardes automatiques',
        type: 'select',
        value: 'daily',
        options: ['hourly', 'daily', 'weekly']
      }
    ]
  },
  {
    id: 'notifications',
    name: 'Notifications',
    icon: Bell,
    description: 'Configuration des alertes et notifications',
    settings: [
      {
        id: 'email_notifications',
        name: 'Notifications par email',
        description: 'Envoyer les alertes importantes par email',
        type: 'toggle',
        value: true
      },
      {
        id: 'sms_notifications',
        name: 'Notifications SMS',
        description: 'Envoyer les alertes urgentes par SMS',
        type: 'toggle',
        value: false
      },
      {
        id: 'notification_frequency',
        name: 'Fréquence des rappels',
        description: 'Intervalle entre les notifications récurrentes',
        type: 'select',
        value: 'daily',
        options: ['real-time', 'hourly', 'daily', 'weekly']
      },
      {
        id: 'emergency_contacts',
        name: 'Contacts d\'urgence',
        description: 'Nombre de contacts à notifier en urgence',
        type: 'number',
        value: 3,
        unit: 'contacts'
      }
    ]
  },
  {
    id: 'integration',
    name: 'Intégrations',
    icon: Globe,
    description: 'APIs et services externes',
    settings: [
      {
        id: 'gps_tracking',
        name: 'Suivi GPS en temps réel',
        description: 'Activer le suivi GPS des véhicules',
        type: 'toggle',
        value: true
      },
      {
        id: 'fuel_card_integration',
        name: 'Intégration cartes carburant',
        description: 'Synchroniser avec les systèmes de cartes carburant',
        type: 'toggle',
        value: true
      },
      {
        id: 'accounting_sync',
        name: 'Synchronisation comptable',
        description: 'Exporter automatiquement vers le logiciel comptable',
        type: 'toggle',
        value: false
      },
      {
        id: 'api_rate_limit',
        name: 'Limite API',
        description: 'Nombre maximum de requêtes API par heure',
        type: 'number',
        value: 1000,
        unit: 'req/h'
      }
    ]
  }
]

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingCategory[]>(mockSettings)
  const [activeCategory, setActiveCategory] = useState<string>('general')
  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (categoryId: string, settingId: string, value: any) => {
    setSettings(prev => prev.map(category => 
      category.id === categoryId 
        ? {
            ...category,
            settings: category.settings.map(setting =>
              setting.id === settingId ? { ...setting, value } : setting
            )
          }
        : category
    ))
    setHasChanges(true)
  }

  const saveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      setHasChanges(false)
      alert('Paramètres sauvegardés avec succès !')
    }, 1000)
  }

  const activeSettings = settings.find(cat => cat.id === activeCategory)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
          <p className="text-muted-foreground">
            Configurez votre application de gestion de flotte
          </p>
        </div>
        {hasChanges && (
          <Button onClick={saveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Catégories</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {settings.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors ${
                      activeCategory === category.id ? 'bg-muted border-r-2 border-primary' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.settings.length} paramètres</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSettings && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <activeSettings.icon className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>{activeSettings.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{activeSettings.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeSettings.settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{setting.name}</h3>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {setting.type === 'toggle' && (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={setting.value}
                            onChange={(e) => updateSetting(activeSettings.id, setting.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      )}
                      
                      {setting.type === 'select' && (
                        <select
                          value={setting.value}
                          onChange={(e) => updateSetting(activeSettings.id, setting.id, e.target.value)}
                          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground min-w-[120px]"
                        >
                          {setting.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      
                      {setting.type === 'input' && (
                        <input
                          type="text"
                          value={setting.value}
                          onChange={(e) => updateSetting(activeSettings.id, setting.id, e.target.value)}
                          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground min-w-[200px]"
                        />
                      )}
                      
                      {setting.type === 'number' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={setting.value}
                            onChange={(e) => updateSetting(activeSettings.id, setting.id, parseInt(e.target.value))}
                            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground w-20"
                          />
                          {setting.unit && (
                            <span className="text-sm text-muted-foreground">{setting.unit}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>État du système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-300">Base de données</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">Opérationnelle</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-300">Services API</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">Tous actifs</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="font-medium text-orange-700 dark:text-orange-300">Maintenance</span>
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Prévue 25/03</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Backup & Recovery */}
          <Card>
            <CardHeader>
              <CardTitle>Sauvegarde & Récupération</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">Dernière sauvegarde</h3>
                    <p className="text-sm text-muted-foreground">15/03/2024 à 02:00</p>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    Réussie
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Database className="h-4 w-4 mr-2" />
                    Créer sauvegarde
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Restaurer données
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 