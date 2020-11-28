
const mongoose = require('mongoose');
//package pour s'assurer que les valeur unique soit respecté :
const uniqueValidator = require('mongoose-unique-validator');
//modele de schema de données pour l'utilisatuer :
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true }
});

//on applique le validateur au schema via la fonction plugin,
//pour s'assurer que les adresse mail seront unique :
userSchema.plugin(uniqueValidator);

//on exporte le schema créé en tant que modèle mongoose appelé schemaProduit
//le rendant par la même disponible pour notre application Express :
module.exports = mongoose.model('User', userSchema);