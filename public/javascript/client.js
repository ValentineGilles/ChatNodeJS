var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('messageinput');
var nameinput = document.getElementById('nameinput');
var feedback = document.getElementById('feedback');
const onlineUsersList = document.getElementById('onlineUsersList');
var login = document.getElementById('login');
var loginform = document.getElementById("loginform");

loginform.addEventListener('submit', function(e) {
    e.preventDefault();
    socket.emit('addUser', nameinput.value);
    nameinput.value=''
    login.style.display='none';

});


form.addEventListener('submit', function (e) {
  e.preventDefault();
  socket.emit('chat message', input.value);
  input.value = '';
});

input.addEventListener("keypress", () => {
  socket.emit("typing", name.value);
});


socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.innerHTML = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('concat message', function (msg) {
  var lastChild = document.getElementById("messages").lastChild;
  lastChild.innerHTML += "<br/>" + msg ;
  messages.appendChild(lastChild);
  window.scrollTo(0, document.body.scrollHeight);
});


socket.on('auto message', function(msg) {
  var item = document.createElement('li');
  item.innerHTML = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('pseudo message', function(msg) {
  var item = document.createElement('li');
  item.innerHTML = "<p>" + msg + "</p> </br>";
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("typing", (name) => {
  feedback.innerHTML = `<p><em>${name}</em> is typing...</p>`;
  setTimeout(() => {
    feedback.innerHTML = "";
  }, 3000);
});

socket.on('update online users', (onlineUsers) => {
  onlineUsersList.innerHTML = '';
  console.log(onlineUsers)
  for (let userId in onlineUsers) {
    const username = onlineUsers[userId];
    const li = document.createElement("li");
    li.id = 'list-Item' + userId;
    li.innerHTML = "🟢  " + username;
    onlineUsersList.appendChild(li);
  }
});