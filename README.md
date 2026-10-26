# So Pure

Marketplace curatée de compléments alimentaires bio et 100 % made in France. So Pure sélectionne et valide chaque produit un par un auprès de marques indépendantes, et guide les clients par besoin (sommeil, digestion, énergie, santé féminine, longévité) plutôt que par simple catégorie.

Projet fil rouge réalisé dans le cadre de la formation Vibe Coding (bootcamp Lion, certification RNCP41143 « Concepteur de solutions no code »).

## Fonctionnalités principales

- **Catalogue et recherche par besoin** : navigation par besoin de santé plutôt que par catégorie produit classique
- **Panier et paiement multi-marques** : une commande peut regrouper des produits de plusieurs marques, avec répartition automatique de la commission et des frais de livraison
- **Espace marque** : chaque marque gère son profil et ses produits, soumis automatiquement au scanner IA avant publication
- **Scanner IA des produits** : agent (Claude Cowork) qui approuve ou rejette automatiquement chaque produit soumis, selon les critères de la charte So Pure
- **Espace admin** : gestion des marques et commissions, journal des décisions du scanner IA, suivi des commandes, tableau de bord en temps réel (Supabase Realtime)

## Stack technique

- **Frontend** : React, TanStack Start (SSR) + TanStack Router, TanStack Query, Tailwind CSS, Radix UI
- **Backend / données** : Supabase (PostgreSQL, Auth, Row Level Security, Realtime)
- **Automatisation / IA** : Claude Cowork (scanner IA des produits)
- **Déploiement** : Vercel
- **Construit avec** : [Lovable](https://lovable.dev), Cursor

## Développement en local

Prérequis : Node.js et npm ([installation via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
git clone https://github.com/eloisepriou-spec/so-pure.git
cd so-pure
npm install
npm run dev
```

L'application nécessite les variables d'environnement d'un projet Supabase (voir `.env.example` si présent, ou demander l'accès au projet Supabase So Pure).

```sh
npm run build   # build de production
npm run test    # tests
```

## Sécurité

- Authentification via Supabase Auth
- Row Level Security activée sur toutes les tables sensibles
- Clés API gérées via variables d'environnement, jamais commitées en clair
- Audit de sécurité réalisé en semaine 5 (voir documentation Notion du projet)

## Licence

Projet pédagogique réalisé dans le cadre d'une formation certifiante. Tous droits réservés.
