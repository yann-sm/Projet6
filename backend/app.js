//Dotenv est un module sans dépandence.
//utilisation du module dotenv pour masquer les informations de connexion à la base de données
//avec des variables d'environnement :
require('dotenv').config();

//on import express :
const express = require('express');
//on importe body-parser pour être capable d'extraire l'objet JSON d'une demande :
const bodyParser  = require('body-parser');
//importation de mongoose :
const mongoose = require('mongoose');
//import de path pour accédé au path de notre server :
const path = require('path');
//importation des routes :
const produitRoutes =  require('./routes/produits');
const userRoutes = require('./routes/user');

//sécurité :
/*helmet pour la sécurité de l'app. Sécurise les requête http, les en-têtes, contrôle la prélécture DNS des navigateurs,
empêche le détournement de clics, ajoute une protection XSS, protège contre le reniflement type MIME,
cross-site scriping, sniffing et clickjacking : */
const helmet = require('helmet');
//nocache pour désactiver la mise en cache du navigateur :
const nocache = require('nocache');

//import de cors :
const cors = require('cors');

//on créé l'application express :
const app = express();



// connection a la basse de donnée :
//mongodb+srv://yann:<password>@clusterp6.tmanv.mongodb.net/<dbname>?retryWrites=true&w=majority
//process.env permet d'accédé à la variable d'environnement voulu, contenant les informations de connexion à la base de donnée détenu dans le fichier .env:
mongoose.connect(process.env.DB_CON,
  { useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//use : fonction qui reçoit la requête et la réponse. 
//l'application utilisera cette fonction pour tous type de requête
//res pour reponse et req pour requête.
//JSON pour recuperer un objet JSON contenent le message spécifié 
//next pour permettre de passé au middleware suivant

//middleware :
/*- AJOUT DE HEADERS -
Ces headers permettent :
d'accéder à notre API depuis n'importe quelle origine ( '*' ) ;
d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.) ;
d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
*/
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});
app.use(cors());
//transforme les données de requête POST en objet JSON exploitable :
app.use(bodyParser.json());

/* Securité :*/
//helmet pour la sécurité de l'app :
app.use(helmet());
//désactiver la mise en cache du navigateur :
app.use(nocache());
/**/

//gestion des images qui seront rentrée :
app.use('/images', express.static(path.join(__dirname, 'images')));
//middleware qui permet de parser les requêtes envoyé par le client :
//app.use(bodyParser.urlencoded({extended: true}));


//routes produit :
app.use('/api/sauces', produitRoutes);
//routes utilisateur :
app.use('/api/auth', userRoutes);

//on exporte cette application pour pouvoir y accéder depuis les autres fichiers, dont notre server node :
module.exports = app;
