// On se connecte au serveur socket
const socket = io();

window.onload = () => {
  // Lorsque l'on appui sur le premier boutton envoyer on récupère les donner du forme et on les stocke dans un tableau
  loginform.addEventListener('submit', function (e) {
    if (nameinput.value != "") {// Si la valeur est vide on envoie une alert
      const room = document.querySelector("#tabs li.active").dataset.room;
      var nameuser = document.querySelector("#nameuser");
      var selectedButton = document.querySelector("input[name='avatar']:checked");
      e.preventDefault();
      socket.emit('addUser', { name: nameinput.value, room: room, image: selectedButton.id });// Stockage des données
      nameuser.innerHTML="Bienvenue "+nameinput.value;// Affichage du nom chosit par l'utilisateur
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
    //On affiche l'image et le nom de l'utilisateur en premier
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

  // Message auto de connexion et de déconnexion
  socket.on('auto_message', function (msg) {
    var messages = document.getElementById('messages');
    var item = document.createElement('li');
    item.innerHTML = msg;
    messages.appendChild(item);// On ajoute notre message 
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

  // Quand on click sur une personne connecté alors on crée un onglet de message privé entre les deux personnes
  document.getElementById("tabs2").addEventListener("click", function (event) {
    //  Si onglet pas actif
    var UserId = event.target.id;
    const rooms = document.getElementById('tabs');
    const lis = rooms.getElementsByTagName("li");
    // On stocke les donnée de la room dans la lsite
    const liste = [];
    for (let i = 0; i < lis.length; i++) {
      liste.push(lis[i].dataset.room)
    }

    // On crée la salle privé
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

    writing.innerHTML = `${user} tape un message...`;// On affiche quel personne est entrain d'écrire

    // On laisse afficher 5 seconde le message après il disparait
    setTimeout(function () {
      writing.innerHTML = "";
    }, 5000);
  });

  // On met a jours la liste d'utilisateur connecter
  socket.on('update online users', (onlineUsers) => {
    const onlineUsersList = document.getElementById('tabs2');
    onlineUsersList.innerHTML = ' ';
    // On regarde toutes les personnes connectées et on les ajoute à la liste
    for (let userId in onlineUsers) {
      const username = onlineUsers[userId].name;
      const li = document.createElement("li");
      li.id = userId;
      li.innerHTML = "🟢  " + username;
      onlineUsersList.appendChild(li);
    }
  });


  // On ajoute une room à la liste
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