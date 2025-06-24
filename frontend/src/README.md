# TaskMaster Pro - Architecture Frontend

Cette application suit une architecture modulaire inspirée des principes de Clean Architecture et adaptée au framework Next.js.

## Structure des dossiers

```
src/
├── app/                    # Dossier App Router de Next.js (pages et routes)
├── components/             # Composants React réutilisables
│   ├── common/             # Composants génériques indépendants du thème
│   ├── ui/                 # Composants d'interface utilisateur
│   │   ├── material/       # Composants spécifiques à Material UI
│   │   └── shadcn/         # Composants spécifiques à ShadCN
│   ├── layout/             # Composants de mise en page
│   ├── tasks/              # Composants liés aux tâches
│   └── theme-switcher/     # Composants pour le switch de thème
├── hooks/                  # Hooks React personnalisés
├── lib/                    # Bibliothèques et utilitaires
│   ├── api/                # Fonctions d'API et clients HTTP
│   ├── utils/              # Fonctions utilitaires
│   └── validation/         # Schémas et fonctions de validation
├── store/                  # Gestion d'état global
├── types/                  # Définitions TypeScript
├── services/               # Services métier et data access
└── theme/                  # Configuration des thèmes
    ├── material-ui/        # Configuration du thème Material UI
    └── shadcn/             # Configuration du thème ShadCN
```

## Architecture

L'architecture s'inspire du modèle MVVM (Model-View-ViewModel) adapté à React/Next.js :

- **Model** : Représenté par les services et le store qui gèrent les données.
- **View** : Représenté par les composants React.
- **ViewModel** : Représenté par les hooks personnalisés et le contexte.

## Gestion des thèmes

Le système de double thème (Material UI et ShadCN) est géré via :
- Des composants spécifiques à chaque thème dans `components/ui/material` et `components/ui/shadcn`
- Des configurations de thème dans `theme/material-ui` et `theme/shadcn`
- Un mécanisme de switch dans les composants `theme-switcher`
