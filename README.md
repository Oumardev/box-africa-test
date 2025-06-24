# TaskMaster Pro

TaskMaster Pro est une application de gestion des tâches collaborative avec une architecture moderne et un thème d'interface utilisateur double (Material UI et ShadCN).

## 📋 Table des matières

- [Présentation](#présentation)
- [Architecture et choix techniques](#architecture-et-choix-techniques)
- [Installation et démarrage](#installation-et-démarrage)
- [Démarrage avec Docker](#démarrage-avec-docker)
- [Pipeline CI/CD](#pipeline-cicd)
- [Tests](#tests)

## 🚀 Présentation

TaskMaster Pro est une application de gestion des tâches collaborative conçue pour les environnements d'entreprise. Elle permet de gérer efficacement des milliers de tâches avec un suivi en temps réel et des fonctionnalités avancées. L'application prend en charge deux thèmes d'interface utilisateur (Material UI et ShadCN) que l'utilisateur peut changer en temps réel.

## 🏗️ Architecture et choix techniques

### Structure du projet

Le projet est organisé en monorepo avec deux dossiers principaux :

```
taskmaster-pro/
├── frontend/          # Application Next.js
├── backend/           # API fictive json-server
├── docker-compose.yml # Configuration Docker Compose
└── .github/workflows/ # Configuration CI/CD
```

### Frontend (Next.js)

- **Framework** : Next.js pour le rendu côté serveur et la génération de sites statiques
- **État global** : React Query pour la gestion des données côté serveur
- **Thèmes UI** : Double implémentation avec Material UI et ShadCN UI
- **Types** : TypeScript pour une meilleure maintenabilité
- **Architecture** : Basée sur les principes de Clean Architecture adaptée à Next.js

### Backend (json-server)

- API fictive basée sur json-server pour le développement
- Points d'accès RESTful pour les opérations CRUD sur les tâches et utilisateurs
- Structure compatible pour une migration facile vers un backend réel

## 💻 Installation et démarrage

### Prérequis

- Node.js 18+ et npm
- Docker et Docker Compose (pour l'exécution conteneurisée)

### Installation classique

```bash
# Installation des dépendances racine
npm install

# Installation des dépendances frontend
cd frontend && npm install

# Démarrage en développement
cd .. && npm run dev
```

Le script `npm run dev` lance simultanément :
- Le frontend sur http://localhost:3000
- L'API json-server sur http://localhost:3001

## 🐳 Démarrage avec Docker

Pour lancer l'application avec Docker, utilisez la commande suivante à la racine du projet :

```bash
docker-compose up
```

Cette commande va :
1. Construire les images Docker pour le frontend et le backend
2. Démarrer les deux services en parallèle
3. Exposer le frontend sur http://localhost:3000
4. Exposer le backend sur http://localhost:3001

Les services sont configurés pour communiquer entre eux via le réseau Docker interne, avec le frontend qui contacte le backend via l'URL `http://backend:3001`.

### Détails de la configuration Docker

#### Frontend (Next.js)

Le frontend utilise un Dockerfile multi-stage pour optimiser la taille et les performances :

- **Stage 1** : Installation des dépendances
- **Stage 2** : Build de l'application
- **Stage 3** : Configuration de l'environnement d'exécution avec seulement les fichiers nécessaires

#### Backend (json-server)

Le backend utilise une image légère Node.js Alpine avec json-server installé globalement. Le fichier `db.json` est monté comme un volume pour permettre la persistance des données.

## 🔄 Pipeline CI/CD

Le projet est configuré avec un pipeline CI/CD GitHub Actions qui automatise les processus de build, test et déploiement.

### Étapes du pipeline

1. **Build et tests** :
   - Checkout du code
   - Installation des dépendances
   - Exécution des linters
   - Exécution des tests avec couverture
   - Validation du JSON backend

2. **Construction des images Docker** :
   - Building de l'image frontend
   - Building de l'image backend
   - Push des images vers GitHub Container Registry (ghcr.io)

3. **Déploiement** :
   - Déploiement simulé avec docker-compose
   - Configuration des variables d'environnement pour la production

### Variables d'environnement

Les variables d'environnement suivantes sont configurées pour le déploiement :

- `API_URL=http://backend:3001` (URL interne Docker pour le backend)
- `NODE_ENV=production`

## 🧪 Tests

Le projet inclut une suite de tests unitaires et d'intégration pour garantir la fiabilité du code.

### Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests avec rapport de couverture
npm run test:coverage

# Exécuter les tests en mode watch
npm run test:watch
```

### Couverture des tests

La configuration CI/CD exige une couverture de tests d'au moins 50% pour les branches, fonctions, lignes et instructions.

Les tests utilisent :
- Jest comme framework de test
- Testing Library pour les tests de composants React
- ts-jest pour la prise en charge de TypeScript

---

## 📝 Licence

[MIT](LICENSE)
