"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow,
  Wind,
  Thermometer,
  Eye,
  Droplets,
  AlertTriangle
} from 'lucide-react'

interface WeatherData {
  location: string
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy'
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  forecast: {
    day: string
    temp: number
    condition: string
  }[]
}

interface WeatherAlert {
  type: 'warning' | 'watch' | 'advisory'
  message: string
  severity: 'low' | 'medium' | 'high'
}

export function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: 'Paris, France',
    temperature: 18,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    pressure: 1013,
    forecast: [
      { day: 'Aujourd\'hui', temp: 18, condition: 'sunny' },
      { day: 'Demain', temp: 16, condition: 'cloudy' },
      { day: 'Mer', temp: 14, condition: 'rainy' },
      { day: 'Jeu', temp: 17, condition: 'sunny' },
      { day: 'Ven', temp: 19, condition: 'sunny' }
    ]
  })

  const [alerts, setAlerts] = useState<WeatherAlert[]>([
    {
      type: 'warning',
      message: 'Risque de verglas sur A6 - Lyon',
      severity: 'high'
    },
    {
      type: 'advisory',
      message: 'Vents forts prévus - Marseille',
      severity: 'medium'
    }
  ])

  // Simulation de mise à jour météo
  useEffect(() => {
    const interval = setInterval(() => {
      setWeatherData(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 10)),
        windSpeed: Math.max(0, prev.windSpeed + (Math.random() - 0.5) * 5),
        visibility: Math.max(1, Math.min(15, prev.visibility + (Math.random() - 0.5) * 2))
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-8 w-8 text-gray-500" />
      case 'rainy': return <CloudRain className="h-8 w-8 text-blue-500" />
      case 'snowy': return <CloudSnow className="h-8 w-8 text-blue-200" />
      default: return <Sun className="h-8 w-8 text-yellow-500" />
    }
  }

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'Ensoleillé'
      case 'cloudy': return 'Nuageux'
      case 'rainy': return 'Pluvieux'
      case 'snowy': return 'Neigeux'
      default: return 'Ensoleillé'
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getImpactMessage = (condition: string) => {
    switch (condition) {
      case 'rainy': return 'Risque de retards - Réduire la vitesse'
      case 'snowy': return 'Conditions dangereuses - Équipements hiver requis'
      case 'stormy': return 'Éviter les routes exposées'
      case 'cloudy': return 'Visibilité réduite possible'
      default: return 'Conditions favorables'
    }
  }

  return (
    <div className="space-y-6">
      {/* Météo actuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getWeatherIcon(weatherData.condition)}
            Conditions Météo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Température et condition */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {weatherData.temperature.toFixed(0)}°C
              </div>
              <div className="text-lg text-muted-foreground mb-2">
                {getConditionText(weatherData.condition)}
              </div>
              <div className="text-sm text-muted-foreground">
                {weatherData.location}
              </div>
            </div>

            {/* Détails météo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Humidité</span>
                </div>
                <span className="font-semibold">{weatherData.humidity.toFixed(0)}%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Vent</span>
                </div>
                <span className="font-semibold">{weatherData.windSpeed.toFixed(0)} km/h</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Visibilité</span>
                </div>
                <span className="font-semibold">{weatherData.visibility.toFixed(1)} km</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Pression</span>
                </div>
                <span className="font-semibold">{weatherData.pressure} hPa</span>
              </div>
            </div>
          </div>

          {/* Impact sur les opérations */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Impact sur les opérations</h4>
            <p className="text-sm text-muted-foreground">
              {getImpactMessage(weatherData.condition)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prévisions */}
      <Card>
        <CardHeader>
          <CardTitle>Prévisions 5 jours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium mb-2">{day.day}</div>
                <div className="mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-lg font-bold">{day.temp}°</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes météo */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Alertes Météo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.severity === 'high' ? 'text-red-500' :
                    alert.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="mt-1">
                      <Badge size="sm" variant={getAlertColor(alert.severity)}>
                        {alert.type === 'warning' ? 'Alerte' :
                         alert.type === 'watch' ? 'Surveillance' : 'Avis'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 