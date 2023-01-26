// On se connecte au serveur socket
const socket = io();

window.onload = () => {

  loginform.addEventListener('submit', function (e) {
    if (nameinput.value != "") {
      const room = document.querySelector("#tabs li.active").dataset.room;
      var nameuser = document.querySelector("#nameuser");
      var selectedButton = document.querySelector("input[name='avatar']:checked");
      e.preventDefault();
      socket.emit('addUser', { name: nameinput.value, room: room, image: selectedButton.id });
      nameuser.innerHTML=nameinput.value;
      nameinput.value = ''
      login.style.display = 'none';
    }
    else
      alert("Nom d'utilisateur vide")
  });

  // On écoute l'évènement submit
  document.querySelector("form").addEventListener("submit", (e) => {
    // On empêche l'envoi du formulaire
    e.preventDefault();
    const message = document.querySelector("#message");
    const room = document.querySelector("#tabs li.active").dataset.room;
    const createdAt = new Date();

    // On envoie le message
    socket.emit("chat_message", {
      message: message.value,
      room: room,
      createdAt: createdAt
    });

    // On efface le message
    document.querySelector("#message").value = "";
  });

  // Envoi du pseudo
  socket.on('pseudo_message', (msg) => {
    var messages = document.getElementById('messages');
    var item = document.createElement('li');
    item.innerHTML = "<div id='pseudo'><img src=Images/" + msg.image + ' id="image-avatar"></img><p>'  + msg.name + "</p></div>";
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });


  // Ajout du message au message précédent
  socket.on('concat_message', (msg) => {
    var messages = document.getElementById('messages');
    var lastChild = document.querySelector("#messages").lastChild;
    lastChild.innerHTML += "<p>" + msg + "</p>";
    messages.appendChild(lastChild);
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Message auto
  socket.on('auto_message', function (msg) {
    var messages = document.getElementById('messages');
    var item = document.createElement('li');
    item.innerHTML = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Ecoute le clic sur les onglets
  document.getElementById("tabs").addEventListener("click", function (event) {
    //  Si onglet pas actif
    var clickedItemId = event.target;
    if (!clickedItemId.classList.contains("active")) {
      // On récupère l'élément actuellement actif et on échange le niveau d'activité
      const actif = document.querySelector("#tabs li.active");
      actif.classList.remove("active");
      clickedItemId.classList.add("active");
      document.querySelector("#messages").innerHTML = "";

      // On quitte l'ancienne salle
      socket.emit("leave_room", actif.dataset.room);
      // On entre dans la nouvelle salle
      socket.emit("enter_room", clickedItemId.dataset.room);
    }
  });

  document.getElementById("tabs2").addEventListener("click", function (event) {
    //  Si onglet pas actif
    var UserId = event.target.id;
    const rooms = document.getElementById('tabs');
    const lis = rooms.getElementsByTagName("li");
    const liste = [];
    for (let i = 0; i < lis.length; i++) {
      liste.push(lis[i].dataset.room)
    }

    socket.emit("create_room", {UserId, liste});
  });

  // On écoute la frappe au clavier 
  document.querySelector("#message").addEventListener("input", () => {
    // On récupère le salon
    const room = document.querySelector("#tabs li.active").dataset.room;
    socket.emit("typing", room);
  });

  // On écoute les messages indiquant que quelqu'un tape au clavier
  socket.on("usertyping", user => {
    const writing = document.querySelector("#writing");

    writing.innerHTML = `${user} tape un message...`;

    setTimeout(function () {
      writing.innerHTML = "";
    }, 5000);
  });

  socket.on('update online users', (onlineUsers) => {
    const onlineUsersList = document.getElementById('tabs2');
    onlineUsersList.innerHTML = ' ';
    for (let userId in onlineUsers) {
      const username = onlineUsers[userId].name;
      const li = document.createElement("li");
      li.id = userId;
      li.innerHTML = "🟢  " + username;
      onlineUsersList.appendChild(li);
    }
  });


  socket.on('update_rooms', (room) => {
    const rooms = document.getElementById('tabs');
    const li = document.createElement("li");
    li.dataset.room = room;
    li.innerHTML = room;
    rooms.appendChild(li);
  });


  // lecture et affichage de toutes les images dans l'ecran d'acceuil
  fetch('/images')
    .then((response) => response.text())
    .then((options) => {
      var pictures = document.getElementById('pictures')
      pictures.innerHTML = options;
    });

}