const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const userRoutes = require('./Routes/user');
const stuffRoutes = require('./Routes/stuff')
const path = require('path');


//Création d'une app express
const app = express();


mongoose.connect('mongodb+srv://obellissens1:iGKEYYlXFKWeiaT6@cluster0.o3ng5x6.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));




const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
//Middleware pour empêcher les requêtes malvaillantes
app.use(express.json());//same body.parser
app.use(cors(corsOptions))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api/auth', userRoutes);
app.use('/api/books', stuffRoutes);



//Un middleware est une fonctiond dans une application express, qui gère les réponses et les requêtes





module.exports = app;
