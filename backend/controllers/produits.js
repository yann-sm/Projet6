//les logiques métiers sont enregistré ici, dans le dossier controllers dans des fonctions -
//import du model pour produit :
const Produit = require('../models/Produit');
//import du package file system (va nous servir a supprimé un fichier) :
const fs = require('fs');


//fonction pour la creation d'un produit :
exports.createProduit = (req, res, next) => {
/*  //requête pour extraire l'objet json de produit :
    const produitObject = JSON.parse(req.body.sauce);
    delete produitObject._id;//supprime l'id.
    //creation d'un nouveau model de produit:
    const produit = new Produit({
        ...produitObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//création du lien de l'image importé
    });  */
    delete req.body._id;//on supprime l'id généré automatiquement et envoyé par le frontend :
    //on stock les données envoyées par le frontend sous forme de form-data dans une variable en les transformant en objet js :
    const sauce = JSON.parse(req.body.sauce);
    console.log(sauce.name);
    //création d'une instance du modèle produit :
    const produit = new Produit({
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

//fonction pour liker ou disliker un produit :
exports.likeDislike = (req, res, next) => {
    //like present dans le body :
    let like = req.body.like;
    //recup userID :
    let userId = req.body.userId;
    //recup id du produit :
    let produitId = req.params.id;

    if(like === 1){
        Produit.updateOne(
            { _id: produitId },
                {
                    $inc: { likes: +1 },//ajout de 1 au nombre de likes.
                    $push: { usersLiked: userId }//ajout de l'utilisatuer au tableau des usersLiked.
                }
        )
        .then(() => { res.status(200).json({ message: "1 like ajouté !"}),console.log('1 like ajouté !')})
        .catch((error) => res.status(400).json({ error}));
    }else if(like === -1){
        Produit.updateOne(
            { _id: produitId },
                {
                    $inc: { dislikes: +1 },//ajout de 1 au nombre de dislikes.
                    $push: { usersDisliked: userId }//ajout de l'utilisatuer au tableau des usersDisliked.
                }
        )
        .then(() => res.status(200).json({ message: "1 dislike ajouté !"}), console.log('1 dislike ajouté !'))
        .catch((error) => res.status(404).json({ error }));
    }else{
        Produit.findOne({ _id: req.params.id })
        .then((produit) => {
            if (produit.usersDisliked.find(userId => userId === req.body.userId)){
                Produit.updateOne(
                    { _id: produitId },
                        {
                            $inc: { dislikes: -1 },//suppression de 1 au nombre de dislikes.
                            $pull: { usersDisliked: userId }//suppression de l'utilisateur au tableau des usersDisliked.
                        }
                )
                .then(() => { res.status(200).json({ message: "changement d'avis !"}), console.log('changement, 1 dislike de moins !')})
                .catch((error) => { res.status(404).json({ error })});
            }else {
                Produit.updateOne(
                    { _id: produitId },
                        {
                            $inc: { likes: -1 },//suppression de 1 au nombre de likes.
                            $pull:  { usersLiked: userId}//suppression de l'utilisateur au tableau des usersliked.
                        }
                )
                .then(() => {res.status(200).json({ message: "changement d'avis !"}), console.log('changement, 1 like en moins !')})
                .catch((error) => { res.status(404).json({ error})});
            }
        });
    }/* */
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