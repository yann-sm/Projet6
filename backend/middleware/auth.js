
const jwt = require('jsonwebtoken');

//middleware d'authentification que l'on va appliquer a toutes les routes de l'application :
module.exports = (req, res, next) => {
    try {
        //on recupere le token :
        const token = req.headers.authorization.split(' ')[1];
        //on decode le token :
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); 
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId){
            throw 'user ID non valabe !';
        }else {
            next();
        }
    }catch (error){
        res.status(401).json({ error: error | 'Requête non authentifiée'});
    }
};