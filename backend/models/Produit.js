//on importe mongoose :
const mongoose = require('mongoose');
//plugin mongoose qui purifie les champs du model avant de les enregistrers dans la bdd :
const sanitizerPlugin = require('mongoose-sanitizer-plugin');
//import des middleware de validation de champ :
const validatorProduit = require('../middleware/validatorProduit');

//création du schema de données du produit :
const schemaProduit = mongoose.Schema({//probleme avec required ??????
    //_id: { type: String, required: true },// l'id est généré automatiquement par mongoose.
    name: { type: String, required: true, validate: validatorProduit.validatorName },
    manufacturer: { type: String, required: true, validate: validatorProduit.validatorManufacturer },
    description: { type: String, required: true },
    heat: { type: Number, required: true, default: 2},
    likes: { type: Number },
    dislikes: { type: Number },
    imageUrl: { type: String, required: true},
    mainPepper: { type: String, required: true, validate: validatorProduit.validatorPepper },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
    userId: { type: String, required: true }
});
schemaProduit.plugin(sanitizerPlugin);


//on exporte le schema créé en tant que modèle mongoose appelé schemaProduit
//le rendant par la même disponible pour notre application Express :
module.exports = mongoose.model('Produit', schemaProduit);