const express = require('express');
const { lstatSync } = require('fs');
const app = express();
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));


const http = require('http');
const { waitForDebugger } = require('inspector');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let connectedUsers = {};
let last_user = "";

io.on('connection', (socket) => {

  socket.on('chat message', (msg) => {
    if (/^\//.test(msg)){
      const firstWord = msg.slice(1, msg.indexOf(" "));
      for (usr in connectedUsers){
        if(firstWord==connectedUsers[usr]){
          newmsg=msg.slice(msg.indexOf(" "), msg.length)
          io.to(usr).emit('chat message', connectedUsers[socket.id]+'is whispering  : '+newmsg)
          io.to(socket.id).emit('chat message', 'You Whispered to '+connectedUsers[usr]+ " : "+newmsg)
        }
      }
    }
    else{
      if (last_user != socket.id)
      {
        io.emit('pseudo message', connectedUsers[socket.id]);
        last_user = socket.id;
        io.emit('concat message', msg);
      }
      else
      {
        io.emit('concat message', msg)
      }
    }
  });

  socket.on('auto message', (msg) => {
    io.emit('auto message', msg);
  });

  socket.on('disconnect', () => {
    io.emit('auto message', connectedUsers[socket.id] + " vient de se déconnecter.");
    delete connectedUsers[socket.id];
    io.emit('update online users', connectedUsers);
  });

  socket.on('addUser', (nickname) => {
    lastname=connectedUsers[socket.id];
    connectedUsers[socket.id] = nickname;
    io.emit("logged");
    io.emit('auto message', connectedUsers[socket.id] +" vient de se connecter.");
    io.emit('update online users', connectedUsers);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing",connectedUsers[socket.id]);
  });

  socket.on('concat message', (msg) => {
    io.emit('concat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on localhost:3000');
});




io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' });