# Fleet Management System

## Description

Application web de gestion de flotte de camions-citernes développée avec Next.js 14, TypeScript et Tailwind CSS. Cette application permet de gérer une flotte de véhicules dédiés à la livraison de produits pétroliers avec des fonctionnalités complètes de suivi, planification et reporting.

## Fonctionnalités Implémentées

### ✅ Dashboard Principal
- **KPIs en temps réel** : Taux de livraison à temps, disponibilité flotte, coût/km, émissions CO₂
- **Graphiques interactifs** : Chart.js pour visualiser les livraisons par jour
- **Carte géographique** : React-Leaflet pour la géolocalisation des camions
- **Widgets informatifs** : Missions du jour, état de la flotte, alertes

### ✅ Gestion des Missions
- **Liste des missions** avec statuts (Planifiée, En cours, Terminée, Annulée)
- **Détails complets** : camion assigné, chauffeur, distance, coûts
- **Calcul automatique** des frais estimés et réels
- **Détection d'écarts** entre distance estimée et réelle
- **Interface de création** de nouvelles missions

### ✅ Gestion de la Flotte
- **Inventaire des camions** : immatriculation, modèle, capacité, odomètre
- **Gestion des chauffeurs** : informations personnelles, permis, disponibilité
- **Statuts en temps réel** : Disponible, En mission, En maintenance, Hors service
- **Alertes de maintenance** : préventive et curative
- **Taux de disponibilité** et métriques de performance

### ✅ Architecture Technique
- **Next.js 14** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling responsive
- **Composants réutilisables** avec Shadcn/ui
- **API Routes** pour les endpoints backend
- **Données mockées** pour le développement

## Structure du Projet

```
src/
├── app/                    # App Router Next.js
│   ├── dashboard/         # Page tableau de bord
│   ├── missions/          # Gestion des missions
│   ├── fleet/            # Gestion de la flotte
│   ├── api/              # API Routes
│   │   ├── missions/     # Endpoints missions
│   │   └── telemetry/    # Données télémétrie
│   └── globals.css       # Styles globaux
├── components/           # Composants React
│   ├── ui/              # Composants UI de base
│   ├── dashboard/       # Composants spécifiques dashboard
│   └── charts/          # Composants graphiques
├── lib/                 # Utilitaires et données
│   ├── utils/           # Fonctions utilitaires
│   └── db/              # Données mockées
└── types/               # Définitions TypeScript
```

## Technologies Utilisées

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Composants UI** : Radix UI + Shadcn/ui
- **Graphiques** : Chart.js + React-Chartjs-2
- **Cartes** : React-Leaflet + Leaflet
- **Icons** : Lucide React
- **Utilitaires** : clsx, tailwind-merge, class-variance-authority

## Installation et Démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start
```

### Accès à l'application
- **URL de développement** : http://localhost:3000
- **Redirection automatique** vers `/dashboard`

## Pages Principales

### 1. Dashboard (`/dashboard`)
- Vue d'ensemble avec 4 KPIs principaux
- Graphique des livraisons par jour (Chart.js)
- Carte interactive avec positions des camions
- Statistiques des missions et alertes

### 2. Missions (`/missions`)
- Liste complète des missions avec filtres
- Statuts colorés et informations détaillées
- Calculs de distance et coûts automatiques
- Boutons d'action (Détails, Terminer)

### 3. Flotte (`/fleet`)
- Inventaire des camions avec statuts
- Liste des chauffeurs et disponibilités
- Alertes de maintenance préventive
- Métriques de disponibilité de la flotte

## API Endpoints

### Missions
- `GET /api/missions` - Liste des missions
- `POST /api/missions` - Créer une nouvelle mission

### Télémétrie
- `GET /api/telemetry` - Données télémétrie
- `POST /api/telemetry` - Enregistrer données IoT

## Données Mockées

Le système utilise des données simulées pour le développement :
- **3 camions** avec différents statuts
- **3 chauffeurs** avec disponibilités variées
- **3 marketeurs** et leurs sites
- **2 missions** (une en cours, une terminée)
- **Données télémétrie** temps réel simulées

## Fonctionnalités Avancées

### Calculs Automatiques
- **Distance** : Calcul haversine entre coordonnées
- **Coûts** : Carburant (0.15€/km) + Péages (0.05€/km) + Primes (50€)
- **Écarts** : Détection automatique >10% entre estimé/réel

### Interface Responsive
- **Design adaptatif** pour desktop, tablette et mobile
- **Navigation latérale** avec indicateurs actifs
- **Grilles flexibles** avec Tailwind CSS

### Composants Réutilisables
- **KPICard** : Affichage des indicateurs avec tendances
- **Card, Button** : Composants UI cohérents
- **DeliveryChart** : Graphique paramétrable
- **FleetMap** : Carte avec marqueurs dynamiques

## Prochaines Étapes (Non implémentées)

### Fonctionnalités à Développer
- [ ] **Authentification** avec NextAuth.js
- [ ] **Base de données** PostgreSQL avec Prisma
- [ ] **Maintenance** : Workflows d'approbation
- [ ] **Rapports** : Génération PDF/Excel
- [ ] **Notifications** : SMS, Push, Email
- [ ] **PWA** : Service Workers, mode offline
- [ ] **Tests** : Jest, React Testing Library

### Intégrations Futures
- [ ] **API de routage** (Google Maps, Here)
- [ ] **Télémétrie IoT** réelle (MQTT)
- [ ] **Signature électronique** (DocuSign)
- [ ] **Passerelle SMS** (Twilio)
- [ ] **Stockage cloud** (AWS S3)

## Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour la gestion moderne de flottes de camions-citernes** 