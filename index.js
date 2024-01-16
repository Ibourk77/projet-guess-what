
// utilisation du framework Express et l'OMR Sequelize pour créer le serveur web et intéragir avec la BDD
// concrètement on configure un serveur Express en définissant des routes pour récupérer les données nécessaires

// charge les variables d'environnement depuis le fichier '.env', utilisé pour stocker des données sensibles
require('dotenv').config();

const router = require('./app/routers/main.router');



// import des modèles définit depuis les fichiers model
const { Theme } = require('./app/models')
//const { Answer } = require('./app/models')

// import du framework Express
const express = require('express');

// création d'une instance d'Express
const app = express();

// définit le port du serveur, qui utilisera soit la variable d'environnement 'PORT' si elle est définit sinon le port 3000 par défaut
const port = process.env.PORT || 3000;
// on s'assure que la variable est bien définit
console.log("bonjour", process.env.PORT);

app.use((req,res, next) => {
  console.log(`${req.method} ${req.path}`);
  next()
})

// Ajout d'un body parser
app.use(express.json()); // Body parser pour les body de format application/json
app.use(express.urlencoded({ extended: true })); // Body parser pour les body de format application/x-www-urlencoded



// définit une route pour afficher un contenu à la racine
app.get('/', (req, res) => { res.send('Hello World!') } );

app.use(router);

// définit une route 'themes' pour récupérer tous les thèmes et les retourne au format Json
app.get('/themes', async (req, res)  => {
  const themes = await Theme.findAll();
  res.json(themes);
})

// définit une route dynamique pour récupérer un thème spécifique selon l'ID, avec les énigmes et réponses associés, retournés au format Json
app.get('/theme/:id', async (req, res) => {
  const theme = await Theme.findByPk(req.params.id, {include: { association: "riddles", include:"answers"}});
  res.json(theme)
})

/*
app.get('/answer', async (req, res) => {
  const answer = await Answer.findAll();
  res.json(answer)
})
*/
app.use((err, req, res, next) => {
  console.log('middleware d\'erreur', err);
  res.status(500).json(err);
})
// port d'écoute du serveur Express avec un retour de son port.
app.listen(port, () => { console.log(`Server running on port ${port}`) } );      


