// On instancie express
const express = require("express");
const app = express();

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
        socket.in(room).emit('auto_message', connectedUsers[socket.id] + " vient de se connecter.");
    });

    // On écoute les sorties dans les salles
    socket.on("leave_room", (room) => {
        // On entre dans la salle demandée
        socket.leave(room);
        lastUser = "";
    });

    // On gère le chat
    socket.on("chat_message", (msg) => {
        // On stocke le message dans la base
        msg.name = connectedUsers[socket.id];
           if (lastUser != socket.id)
        {
            io.in(msg.room).emit('pseudo_message', msg.name);
            lastUser = socket.id;
        }
            io.in(msg.room).emit('concat_message', msg.message);
            //io.in(msg.room).emit("received_message", msg);
    });

    // On écoute les messages "typing"
    socket.on("typing", room => {
        socket.to(room).emit("usertyping", connectedUsers[socket.id]);
    })

    socket.on('addUser', (info) => {
        lastname=connectedUsers[socket.id];
        connectedUsers[socket.id] = info.name;
        socket.emit("enter_room", info.room);
        io.emit('auto_message', connectedUsers[socket.id] +" vient de se connecter.");
        io.emit('update online users', connectedUsers);
    });

});

// On va demander au serveur http de répondre sur le port 3000
http.listen(3000, () => {
});