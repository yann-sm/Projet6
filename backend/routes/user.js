
const express = require('express');
//creation du router :
const router = express.Router();
//controller pour associer les fonctions au differentes routes :
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


module.exports = router;
