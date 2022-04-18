let messages = []; //API messages
let username = {};
let participants = []; // API participants

loadMsg();
login();

function login() {

    username = { name: prompt("Digite seu nome de usuário") };
    const promiseUser = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', username);

    promiseUser.then(connected);
    promiseUser.catch(connectFail);

    function connected(response) {
        console.log(response.status);
    }

    function connectFail(error) {
        if (error.response.status === 400) {
            alert("Usuário já existente. Escolha um nome diferente");
            login();
        }
    }
}
setInterval(stayConnected, 3000);
setInterval(loadMsg, 3000);

function stayConnected() {
    const promiseStay = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', username);
}

function loadMsg() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(callback);
    promise.catch(treatError);

    function callback(response) {
        messages = response.data;
        renderMsg();
    }
}

function renderMsg() {
    const ulMessages = document.querySelector(".chat");
    ulMessages.innerHTML = "";

    for (let i = 0; i < messages.length; i++) {
        if (messages[i].type === "status") {
            ulMessages.innerHTML += `
            <li class="status">
            <span class="time">(${messages[i].time})</span>
            <span class="from"><strong>${messages[i].from}</strong></span>
            <span class="text">${messages[i].text}</span>
            </li>   
            `;
        }
        else if (messages[i].type === "message") {
            ulMessages.innerHTML += `
            <li class="normal">
            <span class="time">(${messages[i].time})</span>
            <span class="from"><strong>${messages[i].from}</strong></span>
            <span>para</span>
            <span class="to"><strong>${messages[i].to}:</strong></span>
            <span class="text">${messages[i].text}</span>
           </li>
            `;
        }
        else if ((messages[i].type === "private_message") && (messages[i].to === username.name)) {
            ulMessages.innerHTML += `
        <li class="reserved">
        <span class="time">(${messages[i].time})</span>
            <span class="from"><strong>${messages[i].from}</strong></span>
            <span>reservadamente para</span>
            <span class="to"><strong>${messages[i].to}:</strong></span>
            <span class="text">${messages[i].text}</span>
           </li>
            `;
        }
    }
    let lastMsg = ulMessages.lastChild;
    lastMsg[i].scrollIntoView();
}

function treatError(error) {
    alert(`Error: ${error.response.status} ${error.response.data}`);
}

function sendMsg() {
    let msgTemplate = {
        from: username.name,
        to: "Todos",
        text: document.querySelector('input').value,
        type: "message"
    }

    const promiseSend = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msgTemplate);
    promiseSend.then(sendMsgSuccess);
    promiseSend.catch(treatError);

    function sendMsgSuccess(response) {
        console.log(response);
        loadMsg();
    }
}

function openMenu() {

    const overlay = document.querySelector(".overlay");
    overlay.classList.toggle("hidden");

    const menu = document.querySelector(".menu");
    menu.classList.toggle("hidden");

    const menuContent = document.querySelector(".menu-content");
    menuContent.classList.toggle("hidden");
    loadParticipants();
}

function loadParticipants() {

    const promiseLoadParticipants = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promiseLoadParticipants.then(callbackParticipants);
    promiseLoadParticipants.catch(treatError);

    function callbackParticipants(response) {
        participants = response.data;
        renderParticipants();
    }

    function renderParticipants() {
        const renderParticipants = document.querySelector(".participants");
        renderParticipants.innerHTML = "";

        for (let i = 0; i < participants.length; i++) {
            renderParticipants.innerHTML += `
            <div class="people">
            <ion-icon name="person-circle"></ion-icon>
            <span>${participants[i].name}</span>
            </div>`
        }
    }
}


