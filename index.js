// On instancie express
const express = require("express");
const app = express();

// On charge "fs"
const fs = require('fs');

// On charge "path"
const path = require("path");

// On autorise le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// On crée le serveur http
const http = require("http").createServer(app);

// On instancie socket.io
const io = require("socket.io")(http);

// On crée la route /
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//On initialise le chemin du dossier
const imagesDir = 'Images';

// On lit toutes les images dans notre dossier pour les afficher 
app.get('/images', (req, res) => {
    fs.readdir(imagesDir, (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
        return;
      }
    
      let options = '<legend id="title">Please select your avatar</legend>';
      files.forEach((file) => {
        options += 
        `<input type="radio" name="avatar" class="sr-only" id="${file}">
        <label for="${file}">
          <img src="${imagesDir}/${file}" alt="${file}">
        </label>`
      });
    
      res.send(options);
    });
  });

let connectedUsers = {};
let lastUser = "";

// On écoute l'évènement "connection" de socket.io
io.on("connection", (socket) => {
    // On écoute les déconnexions
    socket.on("disconnect", () => {
        io.emit('auto_message', connectedUsers[socket.id] + " vient de se déconnecter.");
        delete connectedUsers[socket.id];
        io.emit('update online users', connectedUsers);
        });

    socket.on('auto_message', (msg) => {
        io.broadcast.emit('auto_message', msg);
        });

    // On écoute les entrées dans les salles
    socket.on("enter_room", (room) => {
        // On entre dans la salle demandée
        socket.join(room);
        socket.in(room).emit('auto_message', connectedUsers[socket.id].name + " vient de se connecter.");
        console.log("Nouvel utilisateur :" + connectedUsers[socket.id].room);
    });


    // On écoute les sorties dans les salles
    socket.on("leave_room", (room) => {
        // On entre dans la salle demandée
        socket.leave(room);
        lastUser = "";
        console.log("Départ utilisateur : " + connectedUsers[socket.id].room);
    });
    

    socket.on("create_room", (info) => {
      let roomExist = false;
      room1 = connectedUsers[info.UserId].name + "/" + connectedUsers[socket.id].name;
      room2 = connectedUsers[socket.id].name + "/" + connectedUsers[info.UserId].name;
      for (let i = 0; i < info.lis.length; i++) {
        console.log(info.lis[i]);
        if(info.lis[i].dataset.room === room1 || info.lis[i].dataset.room === room2) {
          roomExist = true;
          break;
        }
      }
      if(!roomExist) {
        io.to(info.UserId).to(socket.id).emit('update_rooms', room1);
      }
      
    });

    // On gère le chat
    socket.on("chat_message", (msg) => {
        // On stocke le message dans la base
        msg.name = connectedUsers[socket.id];
           if (lastUser != socket.id)
        {
            io.in(msg.room).emit('pseudo_message', connectedUsers[socket.id]);
            lastUser = socket.id;
        }
            io.in(msg.room).emit('concat_message', msg.message);
            //io.in(msg.room).emit("received_message", msg);
    });

    // On écoute les messages "typing"
    socket.on("typing", room => {
        socket.to(room).emit("usertyping", connectedUsers[socket.id].name);
    })

    // On ajoute un utilisateur a la liste et on lui affect la room general de base
    socket.on('addUser', (info) => {
        lastname=connectedUsers[socket.id];
        connectedUsers[socket.id] = info;
        socket.join(connectedUsers[socket.id].room);
        io.emit('auto_message', connectedUsers[socket.id].name +" vient de se connecter.");
        io.emit('update online users', connectedUsers);
    });

});

// On va demander au serveur http de répondre sur le port 3000
http.listen(3000, () => {
    console.log('listening on http://localhost:3000');
});