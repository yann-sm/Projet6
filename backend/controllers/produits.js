//les logiques métiers sont enregistré ici, dans le dossier controllers dans des fonctions -
//import du model pour produit :
const Produit = require('../models/Produits');
//fonction pour la creation d'un produit :
exports.createProduit = (req, res, next) => {
    delete req.body._id;
    const produit = new Produit({
        ...req.body// cette syntaxe permet de copier tous les elements du schema(req.body)
    });
    produit.save()// save vient enregistré produit dans la base de données
        .then(() => req.status(201).json({ message: 'Nouvelle sauce enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};
//fonction pour la modification d'un produit :
exports.modifyProduit = (req, res, next) => {
    Produit.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
};
//fonction pour la suppression d'un element :
exports.deleteProduit = (req, res, next) => {
    Produit.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
};
//fonction pour recuperer un seule produit :
exports.getOneProduit = (req, res, next) => {
    Produit.findOne({ _id: req.params.id})
        .then(produit => res.status(200).json(produit))
        .catch(error => res.status(400).json({ error }));
};
//fonction pour recuperer tous les produits :
exports.getAllProduit = (req, res, next) => {
    Produit.find()//find retourne une promise pour recuperer le tableau de la base de données
       .then(produit => res.status(200).json(produit))
       .catch(error => res.status(400).json({ error }));
};