
const mongoose = require('mongoose');
//package pour encrypté les données de la bdd en base 64 :
const encrypt = require('mongoose-encryption');
//package pour s'assurer que les valeurs unique soit respecté (ici, adresse mail unique) :
const uniqueValidator = require('mongoose-unique-validator');
//modele de schema de données pour l'utilisatuer :
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true, match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, " Entrer une adresse mail correct .."]},
    password: { type: String, required: true }
});
/*
Un excellent moyen de générer en toute sécurité cette paire de clés 64-32 est openssl rand -base64 32; openssl rand -base64 64;
On range le resultat obtenu dans deux variable presente dans le fichier .env :
*/
const encKey = process.env.SOME_32BYTE_BASE64_STRING;
const sigKey = process.env.SOME_64BYTE_BASE64_STRING;
//garder email en clair avec excludeFromEncryption, mais transmettre l'erreur sur find () si trafiqué grace à additionalAuthenticatedFields :
userSchema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, /*excludeFromEncryption: ['email'],encryptedFields: ['email'],*/ additionalAuthenticatedFields: ['email'], decryptPostSave: false });
//on applique le validateur au schema via la fonction plugin,
//pour s'assurer que les adresse mail seront unique :
userSchema.plugin(uniqueValidator);


//on exporte le schema créé en tant que modèle mongoose appelé schemaProduit
//le rendant par la même disponible pour notre application Express :
module.exports = mongoose.model('User', userSchema);