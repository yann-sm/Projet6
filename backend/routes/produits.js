//les routes sont enregistré dans le dossier routes. les fonctions associées se trouve dans le dossier controllers -
const express = require('express');
const router = express.Router();

//on associe les fonction au différentes routede produit en important les controllers :
const produitCtrl = require('../controllers/produits');
//import des middlewares :
const auth = require('../middleware/auth');
//import de multer. Un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP comme les images :
const multer = require('../middleware/multer-config');


//router pour créer un element :
router.post('/', auth, multer, produitCtrl.createProduit);
//router récupérer tous les element des differentees sauces depuis la base de données :
router.get('/', auth, produitCtrl.getAllProduit);
//router pour recuperer l'element selectionnée (recuperer un element specifique):
router.get('/:id', auth, produitCtrl.getOneProduit);
//router pour liker ou disliker une sauce :
router.post('/:id/like', auth, produitCtrl.likeDislike);
//router pour suppression d'un element selectionnée :
router.delete('/:id', auth, produitCtrl.deleteProduit);
//router pour mettre a jour (modifier) un element existant :
router.put('/:id', auth, multer, produitCtrl.modifyProduit);

module.exports = router;