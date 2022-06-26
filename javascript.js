let nomeUsuario = {name: prompt("Qual o seu nome?")};
const requisicaoNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', nomeUsuario);
requisicaoNome.catch(perguntarNome);
requisicaoNome.then(requisitarMensagens);

setInterval(requisitarMensagens, 3000);

setInterval(permanencia, 5000);


function perguntarNome () {
    nomeUsuario = {name: prompt("Nome já cadastrado, tente outro nome.")}
    const requisicaoNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', nomeUsuario);
    requisicaoNome.catch(perguntarNome)
    requisicaoNome.then(requisitarMensagens)
}

function requisitarMensagens (resposta) {
    const promessaMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessaMensagens.then(carregarMensagens); 
}

function carregarMensagens (resposta){
    let objetos = resposta.data;

    let novoFeed = objetos.map(rotularMensagens);

    document.querySelector("ul").innerHTML = novoFeed.join("");

    const ultimaMensagem = document.querySelector("ul > li:last-child");
    ultimaMensagem.scrollIntoView();
}

function rotularMensagens(objeto) {

    let classe;
    let corpo;
    
    if(objeto.type === "status"){
        classe = "status";
        corpo = "";
    }

    if(objeto.type === "message"){
        classe = "average";
        corpo = `para<span class="name"> ${objeto.to}:</span>`;
    } 

    if(objeto.type === "private_message"){
        classe = "private";
        corpo = `reservadamente para<span class="name"> ${objeto.to}:</span>`;
    }

    const template = `
    <li class="${classe}">
        <span>
            <span class="hour">(${objeto.time})</span> 
            <span class="name"> ${objeto.from} </span>
            ${corpo}
            ${objeto.text}
        </span>
    </li>
    `
    return template;
}

function permanencia () {
    const requisicaoStatus = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeUsuario);
}