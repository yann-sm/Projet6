
const jwt = require('jsonwebtoken');

//middleware d'authentification que l'on va appliquer a toutes les routes de l'application 
//on vérifie le token de l'utilisateur, si il correspond à l'id de l'utilisateurdans la requête, 
//il sera autorisé à modifier le produit correspondant :
module.exports = (req, res, next) => {
    try {
        //on recupere le token :
        const token = req.headers.authorization.split(' ')[1];
        //on decode le token initialement créé dans controller/user.js:
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
        //on vérifie que le userId envoyé avec la requête correspond a celui encodé dans le token :
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId){
            throw 'user ID non valabe !';
        }else {
            next();//si tout est ok, on passe au prochain middleware
        }
    }catch (error){ //si non, erreur
        res.status(401).json({ error: error | 'Requête non authentifiée'});
    }
};