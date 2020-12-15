
const express = require('express');
//creation du router express :
const router = express.Router();
//controller pour associer les fonctions au differentes routes :
const userCtrl = require('../controllers/user');
//import du middlewares de validation de mot de passe :
const validatorPassword = require('../middleware/validatorPassword');

router.post('/signup', validatorPassword, userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;
