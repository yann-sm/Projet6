
const validatorPassword = require('../models/Password');
const passwordSchema = require('../models/Password');

//vérification que le mot de passe valide le schema décrit dans models :
module.exports =  (req, res, next) => {
    if(!passwordSchema.validate(req.body.password)){
        res.writeHead(400,'{"message": "mot de passe requis: entre 5 et 10 caractères ..}',{ 'content-type': 'application/json'});
        res.end('Format du mot de passe incorrect');
    }else{
        next();
    }
};

