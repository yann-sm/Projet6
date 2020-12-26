
//import de bcrypt :
const bcrypt = require('bcrypt');
//import du model user :
const User = require('../models/User');
//import de jsonwebtoken pour créer et vérifier les tokens d'authentifications:
const jwt = require('jsonwebtoken');
//import de js-base64 pour encodé l'email en base 64 :
const { encode } = require('js-base64');

//fonction pour l'enregistrement de nouveau utilisateurs :
exports.signup = (req, res, next) => {
    //appelle de la fonction de hashage du mot de passe pour le securiser,
    //la fonction asynchrone hash nous renvoie une promise dans lequelle se trouve le hash généré :
    bcrypt.hash(req.body.password, 10)
    //nous créont notre utilisateur et l'enregistrons dans la base de données avec save :
        .then(hash => {
            const user = new User({
                email: encode(req.body.email),//encodage de l'email en base 64
                password: hash
            });
            user.save()
    //renvoie d'une reponse de reussite en cas de succes et d'echec en cas d'echec :
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//fonction pour connecter des utilisateurs existant :
exports.login = (req, res, next) => {
    //on verifie que l'email entrée par l'utilisateur correspond à un utilisateur existant dans la base de données : 
    User.findOne({ email: encode(req.body.email) })//on encode l'email en base 64 pour le comparé a celui stocké dans la base de données.
        .then(user => {//si aucun utilisateur trouvé :
            if(!user){
                return res.status(401).json({ error: 'utilisateur non trouvé !'});
            }
            //si trouvé, nous utilisons la fonction compare de bcrypt pour comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données :
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {//si il n'est pas valide :
                    if(!valid){
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    //si valide, on renvoie l'id d'utilisateur et un token d'autentification :
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( //sign, fonction pour encoder un nouveau token
                            {userId: user._id}, // ce token contient l'id de l'utilisateur
                            'RANDOM_TOKEN_SECRET',//clé de cryptage test
                            { expiresIn: '24h' }//chaque token durera 24h
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};