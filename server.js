// Instanciation de express
const express = require("express");
const app = express();

// Chargement "fs" pour gérer les images et de "path"
const fs = require('fs');
const path = require("path");

// Autorisation du dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// Création serveur http
const http = require("http").createServer(app);

// Instanciation socket.io
const io = require("socket.io")(http);

// Création route /
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Iniatialisation chemin du dossier des images
const imagesDir = 'Images';

// Lecture de toutes les images dans notre dossier pour les afficher 
app.get('/images', (req, res) => {

  fs.readdir(imagesDir, (err, files) => {
    // Gestion des erreurs
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }

    // Choix de l'avatar et du pseudo
    let options = '<legend id="title">Choisissez votre avatar</legend>';
    files.forEach((file) => {
      options +=
        `<input type="radio" name="avatar" class="sr-only" id="${file}">
        <label for="${file}">
          <img id = "choix-avatar" src="${imagesDir}/${file}" alt="${file}">
        </label>`
    });

    res.send(options); // Envoi des informations vers le client
  });
});

let connectedUsers = {}; // Initialisation liste des utilisateur connectés
let lastUser = ""; // Initialisation dernier utilisateur ayant envoyé un message

// Ecoute de l'évènement "connection" de socket.io
io.on("connection", (socket) => {

  // Ecoute des déconnexions 
  socket.on("disconnect", () => {
    // Message automatique à la connexion dans le serveur
    io.to(connectedUsers[socket.id].room).emit('auto_message', connectedUsers[socket.id].name + " vient de se déconnecter.");
    delete connectedUsers[socket.id]; // Supression de l'utilisateur 
    io.emit('update online users', connectedUsers); // Mise à jour de la liste utilisateur
  });

  //Envoi des messages automatique
  socket.on('auto_message', (msg) => {
    io.broadcast.emit('auto_message', msg); // Envoi de l'information de connexion aux autres utilisateurs
  });

  // Ecoute des entrées dans les salles
  socket.on("enter_room", (room) => {
    socket.join(room); // On entre dans la salle demandée
    // Envoi de l'information de connexion dans la nouvelle salle
    socket.in(room).emit('auto_message', connectedUsers[socket.id].name + " vient de se connecter.");
  });


  // Ecoute des sorties des salles
  socket.on("leave_room", (room) => {
    socket.leave(room); // Sortie de la salle
    lastUser = ""; // Réinitialisation de l'utilisateur ayant envoyé le dernier message
  });

  // Vérification de l'existence d'une salle et création si elle n'existe pas
  // Paramètres d'entrée : id de l'utilisateur que l'on veut contacter et liste des attributs "data-room" de chaque salle
  socket.on("create_room", (info) => {
    let roomExist = false; // Booleen existence de salle
    // Création des salles "type"
    room1 = connectedUsers[info.UserId].name + "/" + connectedUsers[socket.id].name;
    room2 = connectedUsers[socket.id].name + "/" + connectedUsers[info.UserId].name;
    // Parcours de toutes les salles de la liste
    for (let i = 0; i < info.liste.length; i++) {
      // Si on trouve une des salles "type" dans la liste de salle, on passe roomExist à true
      if (info.liste[i] === room1 || info.liste[i] === room2) {
        roomExist = true; //
        break;
      }
    }
    // Si la salle n'existe pas, on la crée pour nous et pour l'utilisateur souhaité
    if (!roomExist) {
      io.to(info.UserId).to(socket.id).emit('update_rooms', room1);
    }

  });

  // Gestion du chat
  socket.on("chat_message", (msg) => {
    msg.name = connectedUsers[socket.id]; // Attribution du bon nom d'utilisateur au message

    // Si l'utilisateur n'est pas celui qui a envoyé le dernier message, on envoie sa photo de profil et son pseudo
    if (lastUser != socket.id) {  
      io.in(msg.room).emit('pseudo_message', {user : connectedUsers[socket.id], heure : msg.createdAt});
      lastUser = socket.id;
    }

    // On ajoute le message à l'élément de liste précédent
    io.in(msg.room).emit('concat_message', msg.message);
  });

  // Ecoute des messages en cours d'écriture
  socket.on("typing", room => {
    socket.to(room).emit("usertyping", connectedUsers[socket.id].name);
  })

  // Ajout d'un utilisateur à la liste et on lui affecte la salle "general" 
  socket.on('addUser', (info) => {
    connectedUsers[socket.id] = info; // Ajout d'un utilisateur à la liste des utilisateurs connectés
    socket.join(connectedUsers[socket.id].room); // L'utilisateur rejoint "general" par défaut
    // Envoi de l'information de connexion sur le salon "general"
    io.to(connectedUsers[socket.id].room).emit('auto_message', connectedUsers[socket.id].name + " vient de se connecter.");
    io.emit('update online users', connectedUsers); // MAJ des utilisateurs connectés
  });

  //Envoi du son a tout les utilisateurs sauf lui même
  socket.on ('son',()=>{
    socket.broadcast.emit('son');
  })
});

// Le serveur écoute le port 3000
http.listen(3000, () => {
  console.log('Ecoute : http://localhost:3000');
});