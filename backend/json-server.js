const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./backend/db.json');
const middlewares = jsonServer.defaults();
const path = require('path');
const fs = require('fs');

const options = {
  static: path.join(__dirname, 'public'),
  logger: true,
  bodyParser: true
};

server.use((req, res, next) => {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.path}`);
  next();
});

server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/tasks') {
    const { title, description } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Le titre de la tâche est requis'
      });
    }
    
    if (!description || description.trim() === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'La description de la tâche est requise'
      });
    }
  }
  next();
});

server.use((req, res, next) => {
  setTimeout(() => {
    next();
  }, 300); 
});

server.use((req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (req.method !== 'GET' && (!authHeader || !authHeader.startsWith('Bearer '))) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentification requise'
    });
  }
  
  next();
});

server.use(middlewares);

server.use(router);

server.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: 'Une erreur est survenue sur le serveur'
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API accessible at http://localhost:${PORT}`);
});
