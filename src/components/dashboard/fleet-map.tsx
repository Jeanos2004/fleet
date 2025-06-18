'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockTelemetryData } from '@/lib/db/mock-data'
import { TelemetryData } from '@/types'

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

interface FleetMapProps {
  title?: string
}

export function FleetMap({ title = "Position des camions" }: FleetMapProps) {
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setTelemetryData(mockTelemetryData)
  }, [])

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Chargement de la carte...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] rounded-lg overflow-hidden">
          <MapContainer
            center={[48.8566, 2.3522]} // Paris center
            zoom={10}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {telemetryData.map((data) => (
              <Marker
                key={data.id}
                position={[data.latitude, data.longitude]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">Camion {data.camionId}</h3>
                    <p className="text-sm">Vitesse: {data.vitesse} km/h</p>
                    <p className="text-sm">Odomètre: {data.odometre.toLocaleString()} km</p>
                    <p className="text-sm">Consommation: {data.consommation} L/100km</p>
                    <p className="text-sm text-gray-500">
                      Dernière mise à jour: {new Date(data.timestamp).toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  )
} 