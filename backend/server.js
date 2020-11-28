
/*import du package http :*/
const http = require('http');
//on importe l'application app.js :
const app = require('./app');
 /*
serveur de base :
const server = http.createServer((req, res) => {
    res.end('voila la reponse du serveur avec nodemon! YES');
});
*/
/*on passe notre application au server et sur quelle port elle va tourner :
app.set("port", process.env.PORT || 3000);
const server = http.createServer(app);

server.listen(process.env.PORT || 3000);
//server.listen(port, () => console.log('Server app listening on port '+ port));
*/
/*
installation de nodemon avec 'npm install -g nodemon'
ce qui permet d'éviter de rappeler 'node server' plusieurs fois dans le terminal
on appelle une seule fois 'nodemon server'
*/

//normalizePort renvoie un port valide. Cela configure le port de connection :
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
};
//ajout du port de connection si czlui-ci n'est pas déclaré par l'environnement
//si aucun port n'est fourni on ecoutera sur le port 3000 :
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
    default:
        throw error;
    }
};
//creer un serveur avec express qui utilise app pour les appels server (requetes et reponses)
//ici le server node retourne l'application express :
const server = http.createServer(app);
  
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});
  
server.listen(port);

/* Explication :
la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne.
la fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur.
un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
Notre serveur de développement Node est à présent opérationnel. On peut ainsi ajouter les fonctionnalités appropriées à l'application Express.
*/
