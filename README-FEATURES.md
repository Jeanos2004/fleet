# 🚛 Fleet Management - Système de Gestion de Flotte

## 📋 Vue d'ensemble

Fleet Management est une application web moderne et complète pour la gestion intelligente de flottes de camions-citernes. Développée avec Next.js 15, elle offre une interface utilisateur intuitive et des fonctionnalités avancées pour optimiser les opérations de livraison de carburant.

## ✨ Fonctionnalités principales

### 🎯 Dashboard et Analytics
- **Dashboard temps réel** avec métriques en direct
- **KPIs dynamiques** : taux de livraison, disponibilité flotte, coûts
- **Graphiques interactifs** : Chart.js avec données temps réel
- **Widgets météo** intégrés pour la planification
- **Alertes intelligentes** et notifications push

### 🚚 Gestion de la Flotte
- **Inventaire véhicules** complet avec statuts en temps réel
- **Suivi kilométrage** et consommation carburant
- **Planification maintenance** préventive et curative
- **Historique détaillé** des interventions
- **Gestion des pièces détachées** et stocks

### 👨‍💼 Gestion des Chauffeurs
- **Profils chauffeurs** avec permis et certifications
- **Planning et disponibilités** en temps réel
- **Évaluations et performances** avec système de notation
- **Formations et certifications** avec suivi des échéances
- **Temps de conduite** et respect réglementation

### 📦 Missions et Livraisons
- **Planification missions** avec optimisation des routes
- **Suivi GPS temps réel** des véhicules
- **Gestion multi-sites** et tournées complexes
- **Validation livraisons** avec signatures électroniques
- **Calcul automatique** des coûts et distances

### 🔧 Maintenance et Entretien
- **Maintenance préventive** basée sur le kilométrage/temps
- **Suivi des pannes** et interventions correctives
- **Gestion des fournisseurs** et ateliers partenaires
- **Historique complet** des réparations
- **Alertes maintenance** automatiques

### 📊 Rapports et Exports
- **Rapports opérationnels** détaillés
- **Analyses financières** avec coûts par véhicule
- **Exports Excel/PDF** personnalisables
- **Tableaux de bord** configurables
- **Historiques** et archivage

### 🔐 Administration et Sécurité
- **Gestion des utilisateurs** et rôles
- **Audit logs** complets des actions
- **Paramètres système** configurables
- **Sauvegarde et restauration** des données
- **Sécurité avancée** avec authentification

### 📱 PWA et Mobile
- **Application PWA** installable
- **Mode hors-ligne** avec synchronisation
- **Notifications push** en temps réel
- **Interface responsive** adaptative
- **Géolocalisation** intégrée

### 🌐 IoT et Télémétrie
- **Données télémétrie** en temps réel
- **Capteurs véhicules** : vitesse, consommation, température
- **Géofencing** et zones de sécurité
- **Alertes automatiques** sur anomalies
- **Historique données** et analyses

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 15.3.4** avec App Router
- **React 18** avec Server Components
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Chart.js** pour les graphiques
- **Leaflet** pour les cartes interactives

### Backend et API
- **Next.js API Routes** pour les endpoints
- **Middleware** personnalisé pour l'authentification
- **Mock Data** pour la démonstration
- **Service Worker** pour le cache et PWA

### UI/UX
- **Radix UI** pour les composants accessibles
- **Lucide React** pour les icônes
- **Next Themes** pour le mode sombre
- **Responsive Design** mobile-first
- **Animations fluides** avec Framer Motion

### Outils et Développement
- **ESLint** et **Prettier** pour la qualité du code
- **TypeScript** strict mode
- **Turbopack** pour le développement rapide
- **PWA** avec Service Worker

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Installation
```bash
# Cloner le repository
git clone [repository-url]
cd fleet-management

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

### Variables d'environnement
```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key
```

### Scripts disponibles
```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
npm run type-check   # Vérification TypeScript
```

## 📁 Structure du projet

```
fleet-management/
├── src/
│   ├── app/                    # Pages et routes (App Router)
│   │   ├── (admin)/           # Routes protégées admin
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Pages d'authentification
│   │   └── globals.css        # Styles globaux
│   ├── components/            # Composants réutilisables
│   │   ├── ui/                # Composants UI de base
│   │   ├── charts/            # Composants graphiques
│   │   ├── dashboard/         # Composants dashboard
│   │   ├── forms/             # Formulaires
│   │   └── layout/            # Composants de layout
│   ├── hooks/                 # Hooks personnalisés
│   ├── lib/                   # Utilitaires et configuration
│   │   ├── db/                # Données mockées
│   │   ├── utils/             # Fonctions utilitaires
│   │   └── types/             # Types TypeScript
│   └── types/                 # Types globaux
├── public/                    # Assets statiques
└── docs/                      # Documentation
```

## 🎭 Rôles et Permissions

### Administrateur (ADMIN)
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs et paramètres système
- Audit logs et supervision globale

### Responsable Transport (TRANSPORT_MANAGER)
- Gestion de la flotte et des missions
- Planification et optimisation des tournées
- Rapports opérationnels et financiers

### Chauffeur (DRIVER)
- Consultation de ses missions assignées
- Mise à jour du statut des livraisons
- Accès aux informations véhicule

### Technicien (TECHNICIAN)
- Gestion de la maintenance
- Suivi des réparations et pièces
- Planification des interventions

### Finance (FINANCE)
- Rapports financiers et coûts
- Analyses de rentabilité
- Exports comptables

## 🔧 API Endpoints

### Flotte
- `GET /api/fleet` - Liste des véhicules
- `POST /api/fleet` - Créer un véhicule
- `PUT /api/fleet` - Mettre à jour un véhicule
- `DELETE /api/fleet` - Supprimer un véhicule
- `GET /api/fleet/[id]` - Détails d'un véhicule

### Chauffeurs
- `GET /api/drivers` - Liste des chauffeurs
- `POST /api/drivers` - Créer un chauffeur
- `PUT /api/drivers` - Mettre à jour un chauffeur
- `DELETE /api/drivers` - Supprimer un chauffeur

### Missions
- `GET /api/missions` - Liste des missions
- `POST /api/missions` - Créer une mission
- `PUT /api/missions` - Mettre à jour une mission

### Télémétrie
- `GET /api/telemetry` - Données télémétrie
- `GET /api/telemetry/real-time` - Données temps réel

### Dashboard
- `GET /api/dashboard/stats` - Statistiques dashboard

## 📱 Fonctionnalités PWA

### Installation
L'application peut être installée comme une PWA native sur :
- Ordinateurs (Windows, Mac, Linux)
- Smartphones (iOS, Android)
- Tablettes

### Mode hors-ligne
- Cache intelligent des données critiques
- Synchronisation automatique au retour en ligne
- Notifications push même hors-ligne

### Notifications
- Alertes maintenance
- Missions urgentes
- Anomalies véhicules
- Rappels programmés

## 🎨 Thèmes et Personnalisation

### Thèmes disponibles
- **Mode clair** : Interface moderne et lumineuse
- **Mode sombre** : Confort visuel et économie d'énergie
- **Commutation automatique** selon les préférences système

### Personnalisation
- Couleurs configurables
- Layout adaptatif
- Widgets repositionnables
- Préférences utilisateur sauvegardées

## 🔍 Fonctionnalités avancées

### Recherche intelligente
- Recherche globale dans l'en-tête
- Filtres avancés par module
- Suggestions automatiques
- Historique des recherches

### Notifications système
- Centre de notifications intégré
- Catégorisation par type
- Marquage lu/non lu
- Actions rapides

### Exports et rapports
- Génération PDF avec jsPDF
- Exports Excel avec XLSX
- Rapports personnalisables
- Programmation automatique

### Cartes et géolocalisation
- Cartes interactives avec Leaflet
- Suivi GPS temps réel
- Optimisation des routes
- Géofencing et alertes

## 🚀 Performance et Optimisation

### Optimisations Next.js
- Server Components pour la performance
- Image optimization automatique
- Code splitting intelligent
- Lazy loading des composants

### Cache et PWA
- Service Worker avancé
- Cache stratégique des ressources
- Mise à jour incrémentale
- Synchronisation arrière-plan

### SEO et Accessibilité
- Meta tags optimisés
- Structure sémantique
- Support lecteurs d'écran
- Contraste et lisibilité

## 📈 Métriques et Analytics

### KPIs suivis
- Taux de livraison à temps
- Disponibilité de la flotte
- Coût par kilomètre
- Consommation carburant
- Émissions CO₂
- Satisfaction client

### Analyses avancées
- Tendances temporelles
- Comparaisons périodiques
- Prédictions basées sur l'historique
- Alertes sur seuils

## 🔒 Sécurité

### Authentification
- Système de rôles granulaire
- Sessions sécurisées
- Protection CSRF
- Validation côté serveur

### Audit et traçabilité
- Logs détaillés des actions
- Historique des modifications
- Surveillance des accès
- Alertes sécurité

## 🤝 Contribution

### Guidelines
1. Fork le repository
2. Créer une branche feature
3. Implémenter les changements
4. Tester thoroughly
5. Créer une Pull Request

### Standards de code
- TypeScript strict
- ESLint configuration
- Prettier formatting
- Tests unitaires requis
- Documentation mise à jour

## 📞 Support

### Contact
- Email : support@fleetmanagement.com
- Documentation : [docs.fleetmanagement.com]
- Issues : [GitHub Issues]

### Ressources
- Guide utilisateur complet
- API documentation
- Tutoriels vidéo
- FAQ détaillée

---

**Fleet Management v1.0.0** - Développé avec ❤️ pour optimiser vos opérations de transport 