//les logiques métiers sont enregistré ici, dans le dossier controllers dans des fonctions -
//import du model pour produit :
const Produit = require('../models/Produit');
//import du package file system (va nous servir a supprimé un fichier) :
const fs = require('fs');


//fonction pour la creation d'un produit :
exports.createProduit = (req, res, next) => {
/*  //requête pour extraire l'objet json de produit :
    const produitObject = JSON.parse(req.body.produit);
    delete produitObject._id;//supprime l'id.
    //creation d'un nouveau model de produit:
    const produit = new Produit({
        ...produitObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//création du lien de l'image importé
    });  */
    delete req.body._id;
    const sauce = JSON.parse(req.body.sauce);
    console.log(sauce.name);
    const produit = new Produit({
        //...req.body,
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description, 
        heat: sauce.heat,
        mainPepper: sauce.mainPepper,
        userId: sauce.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    console.log(req.body);
    produit.save()// save vient enregistré produit dans la base de données et retourne une promise si ok ou pas ok :
        .then(() => res.status(201).json({ message: 'Nouvelle sauce enregistré !'}))
        .catch(error =>{
            res.status(400).json({ error })
            console.log(error);
        });
};

//fonction pour recuperer un seule produit :
exports.getOneProduit = (req, res, next) => {
    Produit.findOne({ _id: req.params.id})
        .then(produit => res.status(200).json(produit))
        .catch(error => res.status(400).json({ error }));
};
//fonction pour recuperer tous les produits :
exports.getAllProduit = (req, res, next) => {
    Produit.find()//find retourne une promise pour recuperer tout le tableau de la base de données
       .then(produit => res.status(200).json(produit))
       .catch(error => res.status(400).json({ error }));
};

//fonction pour liker ou diliker un produit :
exports.likeDislike = (req, res, next) => {
    //like present dans le body :
    let like = req.body.like;
    //recup userID :
    let userId = req.body.userId;
    //recup id du produit :
    let produitId = req.params.id;

    //si on like :
    if(like === 1 || like < 1) {
        Produit.updateOne({
            _id: produitId
        },{
            //on push l'utilisateur et on incrémente le compteur de like de 1 :
            $push: { usersLiked: userId },
            $inc: { likes: +1 },  
        })
        .then(() => res.status(200).json({ message: "1 like ajouté !"}))
        .catch((error) => res.status(400).json({ error}))
    }
    //si on dislike :
    if(like === -1) {//
        Produit.updateOne({
            _id: produitId
        },{
            $push: { usersDisliked: userId },
            $inc: { dislikes: +1 }      
        })
        .then(() => { res.status(200).json({ message: "1 dislike ajouté !"})})
        .catch((error) => res.status(400).json({ error}))
    } 
}

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
*/