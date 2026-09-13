// public/scripts/suporte.js
// Front-end da Central de Ajuda: categorias, busca de FAQ e abertura de ticket

const inputBusca = document.getElementById("inputBusca");
const listaCategorias = document.getElementById("listaCategorias");
const listaPerguntas = document.getElementById("listaPerguntas");
const semResultado = document.getElementById("semResultado");
const mensagemLogin = document.getElementById("mensagemLogin");
const inputAssunto = document.getElementById("inputAssunto");
const inputMensagem = document.getElementById("inputMensagem");
const btnAbrirTicket = document.getElementById("btnAbrirTicket");
const mensagemTicketEnviado = document.getElementById("mensagemTicketEnviado");
const listaMeusTickets = document.getElementById("listaMeusTickets");

// Um ícone simples por categoria, só pra deixar a tela parecida com o mockup
const iconesPorCategoria = {
    "Minha conta": "👤",
    "Financeiro": "👛",
    "Meu MEI": "🏪",
    "Problemas": "⚠️",
    "Assinaturas": "📋",
    "Configurações": "⚙️"
};

let categoriaSelecionada = null;

// -------- Categorias --------

function carregarCategorias() {
    fetch("/api/ajuda/categorias")
        .then(function(resposta) { return resposta.json(); })
        .then(function(categorias) {
            desenharCategorias(categorias);
        })
        .catch(function(erro) {
            console.log("Erro ao carregar categorias:", erro);
        });
}

function desenharCategorias(categorias) {
    listaCategorias.innerHTML = "";

    categorias.forEach(function(categoria) {
        const card = document.createElement("div");
        card.className = "cardCategoria";
        if (categoriaSelecionada === categoria.id_categoria) {
            card.classList.add("ativa");
        }

        const icone = iconesPorCategoria[categoria.nome] || "❓";

        card.innerHTML = "<span class='icone'>" + icone + "</span>" + categoria.nome;

        card.addEventListener("click", function() {
            // Clicar de novo na mesma categoria limpa o filtro
            categoriaSelecionada = (categoriaSelecionada === categoria.id_categoria) ? null : categoria.id_categoria;
            inputBusca.value = "";
            desenharCategorias(categorias);
            carregarPerguntas();
        });

        listaCategorias.appendChild(card);
    });
}

// -------- Perguntas frequentes --------

function carregarPerguntas() {
    const url = categoriaSelecionada
        ? "/api/ajuda/perguntas?categoria=" + categoriaSelecionada
        : "/api/ajuda/perguntas";

    fetch(url)
        .then(function(resposta) { return resposta.json(); })
        .then(function(perguntas) {
            desenharPerguntas(perguntas);
        })
        .catch(function(erro) {
            console.log("Erro ao carregar perguntas:", erro);
        });
}

function desenharPerguntas(perguntas) {
    listaPerguntas.innerHTML = "";
    semResultado.style.display = perguntas.length === 0 ? "block" : "none";

    perguntas.forEach(function(pergunta) {
        const item = document.createElement("li");
        item.className = "itemPergunta";

        item.innerHTML =
            "<div class='perguntaTitulo'>" + pergunta.pergunta + " <span>›</span></div>" +
            "<div class='perguntaResposta'>" + pergunta.resposta + "</div>";

        item.querySelector(".perguntaTitulo").addEventListener("click", function() {
            item.classList.toggle("aberta");
        });

        listaPerguntas.appendChild(item);
    });
}

// -------- Busca --------

let timeoutBusca = null;

inputBusca.addEventListener("input", function() {
    clearTimeout(timeoutBusca);

    const termo = inputBusca.value.trim();

    // Espera um pouco depois de parar de digitar, pra não disparar uma busca a cada letra
    timeoutBusca = setTimeout(function() {
        if (!termo) {
            carregarPerguntas();
            return;
        }

        categoriaSelecionada = null;
        carregarCategorias();

        fetch("/api/ajuda/busca?q=" + encodeURIComponent(termo))
            .then(function(resposta) { return resposta.json(); })
            .then(function(perguntas) {
                desenharPerguntas(perguntas);
            })
            .catch(function(erro) {
                console.log("Erro ao buscar:", erro);
            });
    }, 300);
});

// -------- Ticket de suporte --------

function carregarMeusTickets() {
    fetch("/api/ajuda/tickets")
        .then(function(resposta) {
            if (resposta.status === 401) {
                mensagemLogin.style.display = "block";
                btnAbrirTicket.disabled = true;
                return null;
            }
            return resposta.json();
        })
        .then(function(tickets) {
            if (tickets) {
                desenharMeusTickets(tickets);
            }
        })
        .catch(function(erro) {
            console.log("Erro ao carregar tickets:", erro);
        });
}

function desenharMeusTickets(tickets) {
    listaMeusTickets.innerHTML = "";

    tickets.forEach(function(ticket) {
        const item = document.createElement("li");
        item.innerHTML =
            "<span class='statusTicket'>" + ticket.status + "</span>" +
            "<strong>" + ticket.assunto + "</strong><br>" +
            ticket.mensagem;
        listaMeusTickets.appendChild(item);
    });
}

btnAbrirTicket.addEventListener("click", function() {
    const assunto = inputAssunto.value.trim();
    const mensagem = inputMensagem.value.trim();

    if (!assunto || !mensagem) {
        alert("Preenche o assunto e a mensagem antes de enviar.");
        return;
    }

    fetch("/api/ajuda/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assunto: assunto, mensagem: mensagem })
    })
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
            if (!dados.sucesso) {
                alert(dados.erro || "Não foi possível abrir o ticket.");
                return;
            }

            inputAssunto.value = "";
            inputMensagem.value = "";
            mensagemTicketEnviado.style.display = "block";
            carregarMeusTickets();
        })
        .catch(function(erro) {
            console.log("Erro ao abrir ticket:", erro);
        });
});

// -------- Inicialização --------

carregarCategorias();
carregarPerguntas();
carregarMeusTickets();