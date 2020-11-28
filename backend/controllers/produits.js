//les logiques métiers sont enregistré ici, dans le dossier controllers dans des fonctions -
//import du model pour produit :
const Produit = require('../models/Produit');
//import du package file system (va nous servir a supprimé un fichier) :
const fs = require('fs');


//fonction pour la creation d'un produit :
exports.createProduit = (req, res, next) => {
   /* //requête pour extraire l'objet json de produit :
    const produitObject = JSON.parse(req.body.produit);
    delete produitObject._id;//supprime l'id.
    //creation d'un nouveau model de produit:
    const produit = new Produit({
        ...produitObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//création du lien de l'image importé
    });*/
    delete req.body._id;
    const produit = new Produit({ //...req.body,
        name: req.body.name,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     });
    produit.save()// save vient enregistré produit dans la base de données et retourne une promise si ok ou pas ok :
        .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};


//fonction pour la modification d'un produit :
exports.modifyProduit = (req, res, next) => {
    let produitObject = {};
    req.file ? (
        //si la modification contient une image (uilisation d'une ternaire comme structure conditionnelle)
        Produit.findOne({
            _id: req.params.id
        }).then((produit) => {
            //on supprime l'ancienne image du server
            const filename = produit.imageUrl.split('/images/')[1]
            fs.unlinkSync('images/${filename}')
        }),
        produitObject = {
            //on modifie les données et on ajoute la nouvelle images :
            ...JSON.parse(req.body.produit),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
    ) : ( //operateur ternaire equivalent à if(){} else{} => condition ?instruction si vrai : instruction si faux
    //si la modification ne contient pas de nouvelle image
        produitObject = {
            ...req.body
        }
    )
    Produit.updateOne(
        //on applique les parametres de sauceObject
        { 
            _id: req.params.id
        }, {
            ...produitObject,
            _id: req.params.id
        }
    )
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }))
 /* 
    PREMIERE ESSAI :
    const produitObject = req.file ?
    { */
        /*on crée un objet thingObject qui regarde si req.file existe ou non. S'il existe, 
        on traite la nouvelle image ; s'il n'existe pas, on traite simplement l'objet entrant. 
        On crée ensuite une instance Thing à partir de thingObject, puis on effectue la modification. */
 /*       ...JSON.parse(req.body.produit),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Produit.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));
*/
};

//fonction pour la suppression d'un element :
exports.deleteProduit = (req, res, next) => {
    Produit.findOne({ _id: req.params.id })
    .then(produit => {
        const filename = produit.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Produit.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};
/* deleteProduit :
nous utilisons l'ID que nous recevons comme paramètre pour accéder au Produit correspondant dans la base de données.
nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier.
nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à 
supprimer et le callback à exécuter une fois ce fichier supprimé.
dans le callback, nous implémentons la logique d'origine, en supprimant le Produit de la base de données.
*/

//fonction pour recuperer un seule produit :
exports.getOneProduit = (req, res, next) => {
    Produit.findOne({ _id: req.params.id})
        .then(produit => res.status(200).json(produit))
        .catch(error => res.status(400).json({ error }));
};
//fonction pour recuperer tous les produits :
exports.getAllProduit = (req, res, next) => {
    Produit.find()//find retourne une promise pour recuperer tout le tableau de la base de données
       .then(produits => res.status(200).json(produits))
       .catch(error => res.status(400).json({ error }));
};