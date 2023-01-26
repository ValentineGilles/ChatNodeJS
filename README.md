# nodeJs - PLS


## Quelques images de l'application
 - Connexion

<img src="https://zupimages.net/up/23/04/31jz.png">

 - Chat General

<img src="https://zupimages.net/up/23/04/aj0a.png">

 - Chat privé

<img src="https://zupimages.net/up/23/04/bvn8.png">


## Lancement de l'application
```
git clone git@devops.telecomste.fr:rodrigues.hugo/nodejs-pls.git
cd NODEJS-PLS
npm install socket.io
node server.js
```
Il ne reste plus qu'a lancer http://localhost:3000


## Fonctionalité

  - Création d'un utilisateur (choix du nom/image d'utilisateur)
  - Envoyer un message dans un salon general 
  - Envoyer un message privé en cliquant sur le nom d'utilisateur de la personne
  - Concaténation des messages si un même personne parle
  - Message de connexion et de déconnexion automatique
  - Message lorsque quelqu'un rejoint un salon
  - Liste de toutes les personnes connecté 
  - Information lorsque quelqu'un écrit un message


## Avec plus de temps

  - Ajout d'une base de donnée qui aurait pu gérer les compte utilisateur
  - Sauvegarde des anciens messages