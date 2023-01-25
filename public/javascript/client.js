// On se connecte au serveur socket
const socket = io();

window.onload = () => {
    
    loginform.addEventListener('submit', function(e) {
        const room = document.querySelector("#tabs li.active").dataset.room;
          e.preventDefault();
          socket.emit('addUser', {name : nameinput.value, room : room});
          nameinput.value=''
          login.style.display='none';
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
    socket.on('pseudo_message', (msg) =>{
        var messages = document.getElementById('messages');
        var item = document.createElement('li');
        item.innerHTML = "<p>" + msg + "</p> </br>";
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });


      // Ajout du message au message précédent
      socket.on('concat_message', (msg) => {
        var messages = document.getElementById('messages');
        var lastChild = document.querySelector("#messages").lastChild;
        lastChild.innerHTML += "<br/>" + msg ;
        messages.appendChild(lastChild);
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Message auto
      socket.on('auto_message', function(msg) {
        var messages = document.getElementById('messages');
        var item = document.createElement('li');
        item.innerHTML = msg;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });

    // Ecoute le clic sur les onglets
    document.getElementById("tabs").addEventListener("click", function(event){
            //  Si onglet pas actif
            var clickedItemId = event.target;
            if(!clickedItemId.classList.contains("active")){
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

        setTimeout(function(){
            writing.innerHTML = "";
        }, 5000);
    });

    socket.on('update online users', (onlineUsers) => {
        const onlineUsersList = document.getElementById('tabs');
        onlineUsersList.innerHTML = '<li class="active" data-room="general">Général</li>';
        for (let userId in onlineUsers) {
          const username = onlineUsers[userId];
          const li = document.createElement("li");
          li.dataset.room = userId;
          li.innerHTML = "🟢  " + username;
          onlineUsersList.appendChild(li);
        }});


}