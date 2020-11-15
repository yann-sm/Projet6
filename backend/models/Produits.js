//on importe mongoose :
const mongoose = require('mongoose');

/*
_id: "string",
name: "string",
manufacturer: "string",
description: "string",
heat: 4,
likes: 22,
dislikes: 12,
imageUrl: "string",
mainPepper: "string",
usersLiked: [],
usersDisliked: [],
userId: "123",
*/
//création du schema de données :
const schemaProduit = mongoose.Schema({
    name: { type: String, required: true },
    manufactured: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    imageUrl: { type: String, required: true },
    mainPepepr: { type: String, required: true },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
    userId: { type: String, required: true }
});
//on exporte le schema créé en tant que modèle mongoose appelé schemaProduit
//le rendant par la même disponible pour notre application Express :
module.exports = mongoose.model('Produit', schemaProduit);