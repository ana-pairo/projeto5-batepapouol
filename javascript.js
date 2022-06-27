let contato = "";
let visibilidade = "Público";
let nomeUsuario = {name: ""};

let enter_mensagem = document.querySelector("textarea")
enter_mensagem.addEventListener("keydown",
function(e) {
    if(e.key === "Enter"){
        e.preventDefault();
        enviarMensagem();
    }
})

let enter_login = document.querySelector("input")
enter_login.addEventListener("keydown",
function(e) {
    if(e.key === "Enter"){
        e.preventDefault();
        logar();
    }
})

function logar() {
    document.querySelector(".carregando").classList.remove("oculto");
    nomeUsuario = {name: document.querySelector(".telaEntrada input").value};
    const requisicaoNome = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', nomeUsuario);
    requisicaoNome.catch(perguntarNome);
    requisicaoNome.then(loginSucesso);
}

function loginSucesso() {
    setInterval(requisitarMensagens, 3000);
    setInterval(permanencia, 5000);
    setInterval(requisitarUsuarios, 10000);
    trocarAutomatico();
    requisitarMensagens();
}

function perguntarNome () {
    document.querySelector(".carregando").classList.add("oculto");
    if (nomeUsuario.name){
        document.querySelector(".avisoNome").innerHTML = `O nome ${nomeUsuario.name} já está cadastrado, tente outro nome.`;
    } else {
        document.querySelector(".avisoNome").innerHTML = `Por favor digite um nome válido.`;
    }
}

function requisitarMensagens () {
    const promessaMensagens = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promessaMensagens.then(carregarMensagens);
}

function carregarMensagens (resposta){
    let objetos = resposta.data;

    let novoFeed = objetos.map(rotularMensagens);

    document.querySelector(".listaMensagens").innerHTML = novoFeed.join("");

    const ultimaMensagem = document.querySelector(".listaMensagens > li:last-child");
    ultimaMensagem.scrollIntoView();

    document.querySelector(".telaEntrada").classList.add("oculto");
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
    } else if(objeto.type === "private_message" && (objeto.to === nomeUsuario.name || objeto.from === nomeUsuario.name)){
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

  const visi = {
        Público: "message",
        Reservadamente: "private_message"};

  let objetoMensagem = {
    from: nomeUsuario.name,
    to: (contato === "" )? "Todos" : contato,
    text: mensagem,
    type: visi[visibilidade]
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
    let achou = false;

    let novaLista = objetos.map(function renderizarUsuarios(objeto){
        if (objeto.name === contato){
            achou = true;
        }
        return `
        <li class="usuario" onclick="selecionarContato(this);">
            <div><ion-icon name="person-circle"></ion-icon></div>
            <div>${objeto.name}
            <div class="check ${(objeto.name === contato) ? "selecionado" : ""}"><ion-icon name="checkmark-outline" class="check"></ion-icon></div>
            </div>
        </li>
        `
    });

    if (achou === false){
        contato = "";
    }

    trocarAutomatico();

    document.querySelector(".listaUsuarios").innerHTML = `
        <li class="usuarioTodos" onclick="selecionarContato(this);">
            <div><ion-icon name="people"></ion-icon></div>
            <div>Todos
            <div class="check ${(contato === "") ? "selecionado" : ""}"><ion-icon name="checkmark-outline" class="check"></ion-icon></div>
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

function trocarAutomatico () {
    if(contato === "") {
        document.querySelector(".reservado").classList.add("desabilitado");
        document.querySelector(".reservado .check").classList.remove("selecionado");
        document.querySelector(".publico .check").classList.add("selecionado");
        document.querySelector(".descricaoMensagem").innerHTML = `Enviando para Todos`;
        visibilidade = "Público"
    }
    else {
        document.querySelector(".reservado").classList.remove("desabilitado");
        document.querySelector(".descricaoMensagem").innerHTML = `Enviando para ${contato} ${(visibilidade === "Público") ? "(publicamente)" : "(reservadamente)"}`;
    }
}

function selecionarContato (elemento) {

    if(elemento.classList.contains("usuarioTodos")){
        contato = "";
    } else {
        contato = elemento.querySelector("div:nth-child(2)").innerText;
    }

    trocarAutomatico ();
    

    document.querySelector(".listaUsuarios .selecionado").classList.remove("selecionado");
    elemento.querySelector("div.check").classList.add("selecionado"); 
}

function selecionarVisibilidade (elemento) {
    if(contato === "") {
        return
    }

    visibilidade = elemento.querySelector("div:nth-child(2)").innerText;
    document.querySelector(".visibilidade .selecionado").classList.remove("selecionado");
    elemento.querySelector("div.check").classList.add("selecionado"); 

    trocarAutomatico();
}