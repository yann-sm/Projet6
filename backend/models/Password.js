//installation et import de password validator :
const validatorPassword = require('password-validator');
//création d'un schéma :
const passwordSchema = new validatorPassword();
//ajout des propriété au schéma :
passwordSchema
.is().min(5)                                    // Minimum length 5
.is().max(10)                                  // Maximum length 10
//.has().uppercase()                              // Must have uppercase letters
//.has().lowercase()                              // Must have lowercase letters
//.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
//on exporte le scéma :
module.exports = passwordSchema;