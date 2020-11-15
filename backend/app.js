
const express = require('express');
//on créé l'application express :
const app = express();
//on importe body-parser pour être capable d'extraire l'objet JSON d'une demande :
const bodyParser  = require('body-parser');
//importation de mongoose :
const mongoose = require('mongoose');
//on recupere le modele créé dans Produits.js :
const Produit = require('./models/Produits');

// connection a la basse de donnée :
//mongodb+srv://yann:<password>@clusterp6.tmanv.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://yann:09350@clusterp6.tmanv.mongodb.net/TheHottest?retryWrites=true&w=majority',
  { useNewUrlParser: true,
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
    next();
});

app.use(bodyParser.json());
//on creer un middleware qui ne traitera uniquement les requêtes post :
//dedans on créé une instance du modele produit en lui passant un objet Javascript
//contenant toutes les infos requises du corps de requête analysé :
// (on commence par supprimé en amont le faux _id envoyé par le rontend)
app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const produit = new Produit({
       // name: req.body.name,
        //description: req.body.description,
        ...req.body// cette syntaxe permet de copier tous les elements du schema(req.body)

    });
    produit.save()// save vient enregistré produit dans la base de données
        .then(() => req.status(201).json({ message: 'Nouvelle sauce enregistré !'}))
        .catch(error => res.status(400).json({ error }));
});
/*app.post('/api/sauces', (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
      message: 'Objet créé !'
    });
  });*/

//pour recuperer l'element selectionnée (recuperer un element specifique):
app.get('/api/sauces/:id', (req, res, next) => {
    Produit.findOne({ _id: req.params.id})
        .then(produit => res.status(200).json(produit))
        .catch(error => res.status(400).json({ error }));
});

//methode pour mettre a jour un element existant :
app.put('/api/sauces/:id', (req, res, next) => {
    Produit.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });
//methode pour suppression d'un element selectionnée :
app.delete('/api/sauces/:id', (req, res, next) => {
    Produit.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });
  
/*
récupérer tous les element des differentees sauces depuis la base de données :
*/
app.use( (req, res, next) => {
    Produit.find()//find retourne une promise pour recuperer le tableau de la base de données
       .then(produit => res.status(200).json(produit))
       .catch(error => res.status(400).json({ error }));
});

   
    /*  //envoye d'objet depuis le script :
    const stuff =[
       /* {
            _id: 'sildjhv',
            name: 'Smoked Onion',
            manufacturer: 'Butterfly Bakery',
            description: 'The makers at Butterfly Bakery smoke Vermont onions with maplewood to mix with red jalapeños for this sweet and tangy sauce. Great on everything from bagels lox & cream cheese to hummus to pork and whatever else you can name. The medium heat level makes it the perfect smoky sauce for anyone!',
            heat: 3,
            likes: 100,
            dislikes: 0,
            imageUrl: '',
            mainPepper: 'Jalapeños',
            usersLiked: [],
            usersDisliked: []
        },
        {
            _id: 'oimjoijlhui',
            name: 'Black Garlic',
            manufacturer: 'Bravado Spice Company',
            description: 'Team Bravado is back at it with an elevated offering where Carolina Reaper meets aged black garlic. The sweetness of the slowly cooked garlic tempers the initial bitter burn of the Reaper, but not for long... This is a biting hot sauce you\'ll want in marinades, sauces, dressings, and on those garlic wings! ',
            heat: 6,
            likes: 100,
            dislikes: 0,
            imageUrl: '',
            mainPepper: 'Carolina Reaper',
            usersLiked: [],
            usersDisliked: []
        },
        {
             _id: "string",
            name: "small",
            manufacturer: "Saint-Malo",
            description: "string",
            heat: 4,
            likes: 22,
            dislikes: 12,
            imageUrl: "string",
            mainPepper: "string",
            usersLiked: [],
            usersDisliked: [],
            userId: "123",
        },
    ];  
   
    res.status(200).json(stuff);
    next();
});*/
app.use((req, res, next) => {
    console.log("Réponse envoyée avec succès!");
    next();
});



module.exports = app;