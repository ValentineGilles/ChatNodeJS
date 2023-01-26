# Lancement de l'application

- Sur Git :
```
git clone git@devops.telecomste.fr:rodrigues.hugo/nodejs-pls.git
```

- Dans le terminal de votre IDE :

```
cd nodejs-pls
npm init
node server.js
```

Il ne reste plus qu'à ouvrir la page suivante : http://localhost:3000

# Quelques images de l'application
 
 ## Connexion au chat

<img src="https://zupimages.net/up/23/04/31jz.png">


 ## Chat Général

<img src="https://zupimages.net/up/23/04/aj0a.png">


 ## Chat privé

<img src="https://zupimages.net/up/23/04/bvn8.png">




# Fonctionalités implémentés

  - __Création d'un utilisateur__ à la connexion : choix du nom/image d'utilisateur
  - Envoyer un __message dans un salon général__ : tout le monde peut se connecter à ce salon. C'est le salon par défaut à la connexion.
  - Envoyer un __message privé__ en cliquant sur le nom d'utilisateur de la personne : un salon uniquement visible par ces deux personnes est crée.
  - __Concaténation des messages__ si une personne envoie plusieurs messages d'affilés.
  - __Message de connexion et de déconnexion__ d'un utilisateur sur le chat général.
  - __Message lorsque quelqu'un rejoint un salon privé__.
  - __Liste de toutes les personnes connectées__.
  - Information lorsque __quelqu'un écrit un message__.


# Fonctionnalités qu'on aurait aimé ajouté avec plus de temps

  - Meilleure utilisation du __broadcast__, ici très peu utilisée, et rendue plus complexe par la concaténation des messages.
  - Création d'une __base de données__ (SQLite) pour créer des __comptes utilisateurs__ et __sauvegarder les anciens messages__.
  - Créations de __salons privés pour plus de deux personnes__.
  - Ajout de __son propre avatar__.
