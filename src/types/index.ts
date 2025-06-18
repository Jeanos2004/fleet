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
  annee?: number; // Année de fabrication
  capaciteCiterne: number; // en litres
  odometre: number; // en km
  statut: StatutCamion;
  prochaineMaintenance: Date;
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
  telephone: string;
  numeroPermis: string;
  dateExpirationPermis: Date;
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