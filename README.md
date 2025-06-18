Vous êtes un développeur expert en Next.js, React, TypeScript, et architectures modernes pour applications web et mobiles (PWA). Votre tâche est de concevoir et coder une application de gestion de flotte pour camions-citernes, conformément au document technique fourni. Voici les instructions détaillées :

### Objectif du projet
Développer une application web et mobile (PWA) pour gérer une flotte de camions-citernes dédiés à la livraison de produits pétroliers, avec les fonctionnalités suivantes :
- Gestion des clients (marketeurs) et de leurs sites, incluant tarification par site.
- Planification et exécution de missions (uniques ou multiples).
- Suivi des odomètres et calcul des frais de mission (estimés et réels).
- Gestion de la maintenance (curative et préventive) avec workflows d'approbation.
- Génération de fiches de livraison mensuelles et facturation.
- Tableaux de bord avec KPIs (ex. taux de livraison à temps, disponibilité flotte, MTBF/MTTR, émissions CO₂).
- Notifications multicanales (SMS, push, e-mail) et traçabilité.
- Intégration de télémétrie (IoT) pour géolocalisation, capteurs, et odomètres.
- Fonctionnalités avancées : analyses prédictives, optimisation de tournées, éco-responsabilité.
- Contraintes : solution sécurisée, évolutive, responsive, accessible partiellement offline.

### Technologies requises
- **Framework** : Next.js 14 (App Router) avec TypeScript.
- **Frontend** : React, Tailwind CSS pour le style, Shadcn/ui ou NextUI pour les composants UI.
- **Tableaux de bord** : Chart.js pour les graphiques (barres, courbes, camemberts, jauges), React-Leaflet ou Mapbox pour les cartes interactives.
- **Backend** : Next.js API Routes ou serveur séparé (Node.js/Express si besoin). Base de données PostgreSQL pour données relationnelles, TimescaleDB ou InfluxDB pour séries temporelles (télémétrie).
- **Authentification** : NextAuth.js avec OAuth2/JWT, support 2FA.
- **Notifications** : Intégration d'une passerelle SMS (Twilio ou équivalent), push via service workers, e-mails via Nodemailer.
- **Télémétrie** : Simulation d'ingestion de données IoT via MQTT/HTTP (ex. mock API pour capteurs).
- **Offline** : Support partiel offline avec service workers (Workbox) et IndexedDB pour stockage local.
- **Sécurité** : TLS, chiffrement des données sensibles, audit logs, conformité RGPD.
- **Export** : Génération de PDF/Excel pour rapports (utiliser jsPDF, ExcelJS ou équivalent).

### Exigences fonctionnelles détaillées
1. **Gestion des clients et sites** :
   - Entités : Marketeur (nom, coordonnées, contrats signés électroniquement), Site (adresse, distance au parc, prix de livraison).
   - CRUD pour marketeurs et sites, avec signature électronique (ex. via DocuSign ou mock).
   - Stockage des distances initiales (saisie manuelle ou calcul via API de routage).

2. **Planification des missions** :
   - Création de missions uniques (1 site) ou multiples (plusieurs sites).
   - Sélection de camion/chauffeur disponible via interface dispatch.
   - Calcul automatique de la distance estimée (via API de routage ou coordonnées).
   - Optimisation d'itinéraires pour missions multiples (optionnel : simulation d'optimisation).
   - Estimation des frais (distance, péages, carburant, primes).
   - Contraintes : capacité citerne, heures de conduite, disponibilité, maintenance planifiée.
   - Interface dispatch : mini-carte, tableau des missions, recalcul si modification.

3. **Suivi odomètre et frais** :
   - Odomètre initial/final : saisie manuelle ou via télémétrie (mock API).
   - Calcul distance réelle : odom_final - odom_initial.
   - Détection d'écarts (>10%) avec alerte.
   - Saisie des frais réels (péages, carburant) avec upload de justificatifs (photos).
   - Workflow de validation : chauffeur soumet, superviseur valide, finance intègre.

4. **Télémétrie et suivi flotte** :
   - Mock API pour géolocalisation, odomètre, capteurs (consommation, vibration).
   - Dashboard avec carte temps réel (React-Leaflet), alertes comportementales, historique trajets.
   - Traitement asynchrone des flux IoT (stockage dans TimescaleDB).

5. **Maintenance** :
   - **Curative** : Checklist retour de mission (mobile), création de Work Orders (mécanique, électrique, etc.), gestion des pièces (suggestion, commande).
   - **Préventive** : Planification basée sur kilométrage/temps/capteurs, alertes pour maintenance en retard.
   - Workflow : création, affectation, validation, signature électronique.

6. **Reporting et facturation** :
   - Fiches de livraison mensuelles (PDF/Excel) : détails des missions par marketeur.
   - Facturation : génération automatique, suivi des statuts (émise, payée, en retard).
   - Tableaux de bord :
     - **Vue d'ensemble** : Taux de livraison à temps, disponibilité flotte, coûts vs budget.
     - **Livraisons** : Durée moyenne, écart estimé/réel, volume livré.
     - **Flotte** : Taux d'utilisation, disponibilité instantanée.
     - **Maintenance** : MTBF, MTTR, stock pièces critiques.
     - **Finances** : Marge brute, coût/km, délai de paiement.
     - **Éco-responsabilité** : Émissions CO₂, missions optimisées.
   - Widgets : cartes KPI, graphiques (Chart.js), tableaux interactifs, cartes géographiques.

7. **Rôles et permissions** :
   - RBAC : Admin, Responsable transport, Chauffeur, Technicien, Finance, etc.
   - Workflows d'approbation : validation des frais, fiches, maintenance.
   - Audit logs pour toutes actions critiques.

8. **Notifications** :
   - Multicanal : SMS, push, e-mail pour rappels (missions, odomètre, maintenance).
   - Chat léger intégré pour dispatch/chauffeurs.

### Instructions pour le code
- **Structure du projet** :
  - Utiliser l'App Router de Next.js (`/app`).
  - Organiser en dossiers : `/components` (UI réutilisables), `/lib` (utilitaires, API), `/pages/api` (endpoints), `/public` (assets), `/styles` (Tailwind).
  - Exemple de routes : `/dashboard` (vue d'ensemble), `/missions`, `/fleet`, `/maintenance`, `/reports`, `/admin` (gestion utilisateurs/marketeurs).
- **Base de données** : Simuler avec Prisma (PostgreSQL) pour entités (missions, camions, marketeurs) et JSON mock pour télémétrie.
- **Composants** :
  - Dashboard : Grilles Tailwind avec cards KPI, graphiques Chart.js, carte React-Leaflet.
  - Formulaires : Gestion missions/marketeurs avec validation (React Hook Form, Zod).
  - Tableaux : Interactifs avec tri/filtre (ex. TanStack Table).
  - Notifications : Composant toast + intégration push/SMS mock.
- **Fonctionnalités clés à coder** :
  - CRUD pour marketeurs/sites avec formulaire et signature électronique.
  - Planificateur de missions avec calcul de distance (mock API Google Maps/Distance Matrix).
  - Dashboard avec 3 sections (Vue d'ensemble, Livraisons, Flotte) incluant :
    - Cards KPI (ex. taux livraison à temps, disponibilité flotte).
    - Graphique Chart.js pour tendance (ex. livraisons par jour).
    - Carte interactive pour positions camions.
  - Workflow de validation des frais (formulaire + alerte si écart >10%).
  - Simulation de télémétrie : mock API renvoyant odomètre, position, consommation.
- **PWA** : Configurer service worker (Workbox) pour cache des pages principales et données critiques (missions, checklists).
- **Sécurité** : Implémenter NextAuth.js avec rôles, protéger les API, ajouter audit logs (mock).
- **Performances** : Utiliser Server Components, lazy loading, et cache pour optimiser.
- **Tests** : Ajouter tests unitaires (Jest, React Testing Library) pour composants clés (formulaires, tableaux).

### Livrables attendus
1. Projet Next.js initialisé avec structure complète (dossiers, dépendances).
2. Pages principales : `/dashboard`, `/missions`, `/fleet`, `/reports`.
3. Composants réutilisables : Card KPI, Tableau interactif, Formulaire mission, Carte géographique.
4. API Routes : CRUD marketeurs/sites, simulation télémétrie, calcul distance.
5. Exemple de dashboard avec 3 cards KPI, 1 graphique Chart.js, 1 carte.
6. Configuration PWA et notifications mock.
7. Documentation README : instructions pour lancer, dépendances, structure.

### Contraintes
- Code modulaire, lisible, typé avec TypeScript.
- Respecter les standards d'accessibilité (WCAG).
- Simuler les données (missions, camions, télémétrie) si pas d'API réelle.
- Prioriser les fonctionnalités de base (CRUD, dashboard simple, planification missions) pour un MVP.

### Exemple de code attendu
- Page `/dashboard` avec grille Tailwind, 3 cards KPI (ex. taux livraison, disponibilité, coût/km), graphique Chart.js (barres pour livraisons par jour), carte React-Leaflet.
- API Route `/api/missions` pour lister/créer missions avec calcul distance mock.
- Composant `<MissionForm />` pour créer mission avec validation.
- Service worker pour cache offline des pages dashboard et missions.

### Priorisation
1. Structure projet et configuration (Next.js, Tailwind, Prisma, NextAuth).
2. Pages dashboard et missions avec composants de base.
3. API Routes pour CRUD et mock télémétrie.
4. Dashboard MVP avec KPIs et graphique.
5. PWA et notifications de base.

Veuillez générer le code pour un MVP respectant ces exigences, en commençant par la structure du projet, les pages principales, et un dashboard simple avec 3 KPIs, 1 graphique, et 1 carte. Ajoutez des commentaires clairs pour expliquer chaque partie. Si des clarifications sont nécessaires, posez des questions avant de coder.
