# Dockerfile pour le backend json-server
FROM node:20-alpine

WORKDIR /app

# Copier db.json uniquement
COPY db.json ./

# Installer json-server globalement
RUN npm install -g json-server@1.0.0-beta.3

# Exposer le port utilisé par json-server
EXPOSE 3001

# Commande de démarrage de json-server
CMD ["json-server", "--watch", "db.json", "--port", "3001", "--host", "0.0.0.0"]
