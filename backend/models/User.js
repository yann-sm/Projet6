
const mongoose = require('mongoose');
//package pour s'assurer que les valeur unique soit respecté :
const uniqueValidator = require('mongoose-unique-validator');
//modele de schema de données pour l'utilisatuer :
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true}
});

//on applique le validateur au schema via la fonction plugin,
//pour s'assurer que les adresse mail seront unique :
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);