const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const helmet = require('helmet');
// securisation : configuration des en-têtes HTTP, la protection contre les attaques XSS, la désactivation de la mise en cache côté client, etc.
//https://www.npmjs.com/package/helmet
const mongoSanitize = require('express-mongo-sanitize');
//plugin  contre les attaques d'injection de code malveillant dans les requêtes MongoDB
//https://www.npmjs.com/package/express-mongo-sanitize
const userRoutes = require('./Routes/user');
const bookRoutes = require('./Routes/book')
const path = require('path');
require('dotenv').config(); // Charge les variables d'environnement à partir du fichier .env

//Création d'une app express
const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
//Un middleware est une fonction dans une application express, qui gère les réponses et les requêtes
//Middleware pour empêcher les requêtes malvaillantes
//on securise
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-site' },
  dnsPrefetchControl: true,
  expectCt: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true
}));

app.use(express.json());//same body.parser
app.use(cors(corsOptions))
app.use(mongoSanitize());

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;
