//les routes sont enregistré dans le dossier routes. les fonctions associées se trouve dans le dossier controllers -
const express = require('express');
const router = express.Router();
//on recupere le modele créé dans Produits.js :
//const Produit = require('../models/Produits');
const produitCtrl = require('../controllers/produits');

const auth = require('../middleware/auth');

router.post('/', auth, produitCtrl.createProduit);
/*router.post('/', (req, res, next) => {
    delete req.body._id;
    const produit = new Produit({
       // name: req.body.name,
        //description: req.body.description,
        ...req.body// cette syntaxe permet de copier tous les elements du schema(req.body)
    });
    produit.save()// save vient enregistré produit dans la base de données
        .then(() => req.status(201).json({ message: 'Nouvelle sauce enregistré !'}))
        .catch(error => res.status(400).json({ error }));
});*/

//pour recuperer l'element selectionnée (recuperer un element specifique):
router.get('/:id', auth, produitCtrl.getOneProduit);
/*router.get('/:id', (req, res, next) => {
    Produit.findOne({ _id: req.params.id})
        .then(produit => res.status(200).json(produit))
        .catch(error => res.status(400).json({ error }));
});*/
//methode pour mettre a jour (modifier) un element existant :
router.put('/:id', auth, produitCtrl.modifyProduit);
/*router.put('/:id', (req, res, next) => {
    Produit.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });*/
//methode pour suppression d'un element selectionnée :
router.delete('/:id', auth, produitCtrl.deleteProduit);
/*router.delete('/:id', (req, res, next) => {
    Produit.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });*/
  
/*
récupérer tous les element des differentees sauces depuis la base de données :
*/
/**/
router.get('/', auth, produitCtrl.getAllProduit);
/*router.get('/', (req, res, next) => {
    Produit.find()//find retourne une promise pour recuperer le tableau de la base de données
       .then(produit => res.status(200).json(produit))
       .catch(error => res.status(400).json({ error }));
});*/
/*router.get((req, res, next) => {
    console.log("Réponse envoyée avec succès!");
    next();
});*/
module.exports = router;