
//import de bcrypt :
const bcrypt = require('bcrypt');
//import du model user :
const User = require('../models/User');
//import de jsonwebtoken :
const jwt = require('jsonwebtoken');


//fonction pour l'enregistrement de nouveau utilisateurs :
exports.signup = (req, res, next) => {
    //appelle de la fonction de hashage du mot de pesse pour le securiser,
    //la fonction asynchrone hash nous renvoie une promise dans lequelle se trouve le hash généré :
    bcrypt.hash(req.body.password, 10)
    //nous créont notre utilisateur et l'enregistrons dans la base de données avec save :
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
    //revoie d'une eponse de reussite en cas de succes et d'echec en cas d'echec :
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//fonction pour connecter des utilisateurs existant :
exports.login = (req, res, next) => {
    //on recupere l'utilisateur rentré dans la bse de données : 
    User.findOne({ email: req.body.email })
        .then(user => {//si aucun utilisateur trouvé :
            if(!user){
                return res.status(401).json({ error: 'utilisateur non trouvé !'});
            }
            //si trouvé, on compare les password :
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {//si il n'est pas valide :
                    if(!valid){
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    //si valide, on renvoie l'id d'utilisateur et un token d'autentification :
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',//clé de cryptage test
                            { expiresIn: '24h' }//chaque token durera 24h
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};