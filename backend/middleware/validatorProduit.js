
//(npm i mongoose-validator -s)installer mongoose validator :
const validate = require('mongoose-validator');

//validation du champ nom de la sauce :
exports.validatorName = [
    validate({
        validator: 'isLength',
        arguments: [3, 60],
        message: 'Le nom de la sauce doit contenir entre 3 et 60 caractères !',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-z\d\-_\s]+$/i,//regex pour restreindre le type de symbole utilisables.
        message: 'utilisez uniquement des chiffres et des lettres !',
    }),
    
];
//validation pour le champ manufacture :
exports.validatorManufacturer = [
    validate({
        validator: 'isLength',
        arguments: [3, 40],
        message: 'Le nom de la manufacture doit contenir entre 3 et 40 caractères !',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-z\d\-_\s]+$/i,//regex pour restreindre le type de symbole utilisables.
        message: 'utilisez uniquement des chiffres et des lettres !',
    }),
];
//validation pour le champ description :
exports.validatorDescription = [
    validate({
        validator: 'isLength',
        arguments: [10, 160],
        message: 'La description doit contenir entre 10 et 160 caractères !',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-z\d\-_\s]+$/i,//regex pour restreindre le type de symbole utilisables.
        message: 'utilisez uniquement des chiffres et des lettres !',
    }),
];
//validation pour le champ ingrédient principal :
exports.validatorPepper = [
    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Le principal ingrédient doit contenir entre 3 et 20 caractères !',
    }),
    validate({
        validator: 'matches',
        arguments: /^[a-z\d\-_\s]+$/i,//regex pour restreindre le type de symbole utilisables.
        message: 'utilisez uniquement des chiffres et des lettres !',
    }),
];