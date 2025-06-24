# Dockerfile pour Next.js avec une approche multi-stage pour optimiser la taille

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copier les dépendances du stage précédent
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Définition des variables d'environnement pour la build
ARG API_URL
ARG DATABASE_URL
ARG NODE_ENV

ENV API_URL=$API_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=$NODE_ENV

# Build de l'application
RUN npm run build

# Stage 3: Runner (production)
FROM node:20-alpine AS runner
WORKDIR /app

# Définition de l'environnement de production
ENV NODE_ENV=production

# Créer un utilisateur non-root pour des raisons de sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copier le contenu nécessaire pour le runtime
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Changement de propriétaire pour l'utilisateur non-root
RUN chown -R nextjs:nodejs /app

# Utilisation de l'utilisateur non-root
USER nextjs

# Exposition du port
EXPOSE 3000

# Définition des variables d'environnement pour l'exécution
ENV PORT 3000
ENV API_URL=$API_URL
ENV DATABASE_URL=$DATABASE_URL

# Commande de démarrage
CMD ["node", "server.js"]
