const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
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
app.use(express.json());//same body.parser
app.use(cors(corsOptions))

app.use('/api/auth', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;
