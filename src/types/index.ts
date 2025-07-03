// Types pour l'application de gestion de flotte

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  TRANSPORT_MANAGER = 'TRANSPORT_MANAGER',
  DRIVER = 'DRIVER',
  TECHNICIAN = 'TECHNICIAN',
  FINANCE = 'FINANCE',
}

export interface Marketeur {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  contractSigne: boolean;
  dateSignature?: Date;
  sites: Site[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Site {
  id: string;
  nom: string;
  adresse: string;
  latitude: number;
  longitude: number;
  distanceFromDepot: number; // en km
  prixLivraison: number; // en €
  marketeurId: string;
  marketeur?: Marketeur;
  createdAt: Date;
  updatedAt: Date;
}

export interface Camion {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  type?: string; // Ajout pour compatibilité
  annee?: number; // Année de fabrication
  capaciteCiterne: number; // en litres
  capacite?: number; // Alias pour capaciteCiterne
  kilometrage?: number; // Alias pour odometre
  odometre: number; // en km
  statut: StatutCamion;
  prochaineMaintenance: Date;
  derniereMaintenance?: Date; // Ajout pour compatibilité
  chauffeurId?: string | null; // Ajout pour compatibilité
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum StatutCamion {
  DISPONIBLE = 'DISPONIBLE',
  EN_MISSION = 'EN_MISSION',
  EN_MAINTENANCE = 'EN_MAINTENANCE',
  HORS_SERVICE = 'HORS_SERVICE',
}

export interface Chauffeur {
  id: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone: string;
  numeroPermis: string;
  dateExpirationPermis: Date;
  statut?: string;
  dateEmbauche?: Date;
  adresse?: string;
  dateNaissance?: Date;
  experience?: number;
  rating?: number;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mission {
  id: string;
  type: TypeMission;
  statut: StatutMission;
  camionId: string;
  camion?: Camion;
  chauffeurId: string;
  chauffeur?: Chauffeur;
  sites: MissionSite[];
  dateDebut: Date;
  dateFin?: Date;
  odomètreDebut?: number;
  odomètreFin?: number;
  distanceEstimee: number;
  distanceReelle?: number;
  fraisEstimes: FraisMission;
  fraisReels?: FraisMission;
  ecartDistance?: number; // en %
  validee: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum TypeMission {
  UNIQUE = 'UNIQUE',
  MULTIPLE = 'MULTIPLE',
}

export enum StatutMission {
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
}

export interface MissionSite {
  id: string;
  missionId: string;
  siteId: string;
  site?: Site;
  ordre: number;
  heureArrivee?: Date;
  heureDepart?: Date;
  quantiteLivree?: number;
}

export interface FraisMission {
  carburant: number;
  peages: number;
  primes: number;
  total: number;
}

export interface MaintenanceWorkOrder {
  id: string;
  camionId: string;
  camion?: Camion;
  type: TypeMaintenance;
  statut: StatutMaintenance;
  description: string;
  technicienId?: string;
  technicien?: User;
  dateCreation: Date;
  dateDebut?: Date;
  dateFin?: Date;
  pieces: PieceMaintenance[];
  cout: number;
  validee: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum TypeMaintenance {
  CURATIVE = 'CURATIVE',
  PREVENTIVE = 'PREVENTIVE',
}

export enum StatutMaintenance {
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
}

export interface PieceMaintenance {
  id: string;
  nom: string;
  reference: string;
  quantite: number;
  prixUnitaire: number;
  workOrderId: string;
}

export interface TelemetryData {
  id: string;
  camionId: string;
  timestamp: Date;
  latitude: number;
  longitude: number;
  vitesse: number;
  odometre: number;
  consommation: number;
  vibration: number;
  temperature: number;
}

export interface KPI {
  id: string;
  title: string;
  value: string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  change?: string;
  description?: string;
  status?: 'good' | 'warning' | 'error';
}

export interface Notification {
  id: string;
  userId: string;
  titre: string;
  message: string;
  type: TypeNotification;
  lue: boolean;
  createdAt: Date;
}

export enum TypeNotification {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface FactureMensuelle {
  id: string;
  marketeurId: string;
  marketeur?: Marketeur;
  mois: number;
  annee: number;
  missions: Mission[];
  montantTotal: number;
  statut: StatutFacture;
  dateEmission: Date;
  datePaiement?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum StatutFacture {
  EMISE = 'EMISE',
  PAYEE = 'PAYEE',
  EN_RETARD = 'EN_RETARD',
}

// Types alternatifs pour compatibilité avec les composants UI

export interface ChartMission {
  id: string
  title: string
  vehicleId: string
  vehiclePlate: string
  driverId: string
  driverName: string
  origin: string
  destination: string
  startDate: string
  endDate: string
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  distance: number
  cargo: string
  priority: 'low' | 'medium' | 'high'
}

export interface UIDriver {
  id: string
  nom: string
  prenom: string
  firstName: string // Obligatoire pour compatibilité driver-manager
  lastName: string // Obligatoire pour compatibilité driver-manager
  email: string // Obligatoire pour compatibilité driver-manager
  telephone?: string
  phone: string // Obligatoire pour compatibilité driver-manager
  permis?: string
  licenseNumber: string // Obligatoire pour compatibilité driver-manager
  licenseExpiry: string // Obligatoire pour compatibilité avec driver-manager
  statut: string
  status?: string // Alias pour statut
  dateEmbauche?: string
  hireDate: string // Obligatoire pour compatibilité driver-manager
  rating?: number
  experience?: number
  currentVehicle?: string
  totalMissions?: number
}

export interface UIVehicle {
  id: string
  immatriculation: string
  modele: string
  type?: string
  statut: string
  capacite?: number
  kilometrage?: number
  derniereMaintenance?: string
  prochaineMaintenance?: string
  chauffeurId?: string | null
  annee?: number
}

// Fonction utilitaire pour convertir les types
export function convertMissionToChart(mission: Mission): ChartMission {
  return {
    id: mission.id,
    title: `Mission ${mission.id}`,
    vehicleId: mission.camionId,
    vehiclePlate: mission.camion?.immatriculation || '',
    driverId: mission.chauffeurId,
    driverName: mission.chauffeur ? `${mission.chauffeur.prenom} ${mission.chauffeur.nom}` : '',
    origin: mission.sites[0]?.site?.nom || '',
    destination: mission.sites[mission.sites.length - 1]?.site?.nom || '',
    startDate: mission.dateDebut.toISOString(),
    endDate: mission.dateFin?.toISOString() || '',
    status: mission.statut === StatutMission.PLANIFIEE ? 'planned' :
            mission.statut === StatutMission.EN_COURS ? 'in_progress' :
            mission.statut === StatutMission.TERMINEE ? 'completed' : 'cancelled',
    distance: mission.distanceEstimee,
    cargo: 'Carburant',
    priority: 'medium'
  }
}

// Fonction pour formater les dates
export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'N/A'
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('fr-FR')
  }
  return date.toLocaleDateString('fr-FR')
} 