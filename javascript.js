let contato = "Todos";
let visibilidade = "publico";

let nomeUsuario = {name: prompt("Qual o seu nome?")};
const requisicaoNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', nomeUsuario);
requisicaoNome.catch(perguntarNome);
requisicaoNome.then(requisitarMensagens);

setInterval(requisitarMensagens, 3000);

setInterval(permanencia, 5000);

setInterval(requisitarUsuarios, 10000);

let enter = document.querySelector("textarea")
enter.addEventListener("keydown",
function(e) {
    if(e.key === "Enter"){
        e.preventDefault();
        enviarMensagem();
    }
})

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

    document.querySelector(".listaMensagens").innerHTML = novoFeed.join("");

    const ultimaMensagem = document.querySelector(".listaMensagens > li:last-child");
    ultimaMensagem.scrollIntoView();
}

function rotularMensagens(objeto) {

    let classe;
    let corpo;
    
    if(objeto.type === "status"){
        classe = "status";
        corpo = "";
    } else if(objeto.type === "message"){
        classe = "average";
        corpo = `para<span class="name"> ${objeto.to}:</span>`;
    } else if(objeto.type === "private_message" && objeto.to === nomeUsuario.name){
        classe = "private";
        corpo = `reservadamente para<span class="name"> ${objeto.to}:</span>`;
    } else {
        return
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

function enviarMensagem() {
  let mensagem = document.querySelector("textarea").value

  if(mensagem === ""){
    return
  }

  let objetoMensagem = {
    from: nomeUsuario.name,
    to: "Todos",
    text: mensagem,
    type: "message"
  }

  let requisicaoMensagem = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', objetoMensagem);
  requisicaoMensagem.then(requisitarMensagens);
  requisicaoMensagem.catch(reload);

  document.querySelector("textarea").value = "";

}

function reload (erro) {
    window.location.reload();
}

function requisitarUsuarios(){
    const promessaUsuarios = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    promessaUsuarios.then(carregarUsuarios);
}

function carregarUsuarios(resposta){
    let objetos = resposta.data;

    let novaLista = objetos.map(function renderizarUsuarios(objeto){
        return `
        <li class="usuario" onclick="selecionarContato(this);">
            <div><ion-icon name="person-circle"></ion-icon></div>
            <div>${objeto.name}
            <div class="check"><ion-icon name="checkmark-outline" class="check"></ion-icon></div>
            </div>
        </li>
        `
    });

    document.querySelector(".listaUsuarios").innerHTML = `
        <li class="usuario" onclick="selecionarContato(this);">
            <div><ion-icon name="people"></ion-icon></div>
            <div>Todos
            <div class="check selecionado"><ion-icon name="checkmark-outline" class="check"></ion-icon></div>
            </div>
         </li>`
    ;
    
    document.querySelector(".listaUsuarios").innerHTML += novaLista.join("");
}

function mostrarContatos () {
    requisitarUsuarios();
    document.querySelector(".cortina").classList.toggle("oculto");
    document.querySelector(".barraLateral").classList.toggle("show-up");
}

function selecionarContato (elemento) {
    contato = elemento.querySelector("div:nth-child(2)").innerText;
    document.querySelector(".listaUsuarios .selecionado").classList.remove("selecionado");
    elemento.querySelector("div.check").classList.add("selecionado"); 
}

function selecionarVisibilidade (elemento) {
    visibilidade = elemento.querySelector("div:nth-child(2)").innerText;
    document.querySelector(".visibilidade .selecionado").classList.remove("selecionado");
    elemento.querySelector("div.check").classList.add("selecionado"); 
}