# nodeJs - PLS


## Quelques images de l'application
 - Connexion

<img src="https://zupimages.net/up/23/04/31jz.png" width="1200" height="700">

 - Chat General

<img src="https://zupimages.net/up/23/04/aj0a.png" width="1200" height="800">

 - Chat privé

<img src="https://zupimages.net/up/23/04/bvn8.png" width="1200" height="800">


## Lancement de l'application
```
git clone git@devops.telecomste.fr:rodrigues.hugo/nodejs-pls.git
cd NODEJS-PLS
npm install socket.io
node server.js
```
Il ne reste plus qu'a lancer http://localhost:3000


## Fonctionalité

  - création d'un utilisateur (choix du nom/image d'utilisateur)
  - envoyer un message dans un salon general 
  - envoyer un message privé en cliquant sur le nom d'utilisateur de la personne
  - concaténation des messages si un même personne parle
  - message de connexion et de déconnexion automatique
  - message lorsque quelqu'un rejoint un salon
  - liste de toutes les personnes connecté 
  - information lorsque quelqu'un écrit un message


## Avec plus de temps

  - ajout d'une base de donnée qui aurait pu gérer les compte utilisateur
  - sauvegarde des anciens messages