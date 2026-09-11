// public/scripts/assinaturas.js
// Front-end da tela de Assinaturas: busca os planos na API e desenha os cards na tela

const listaPlanos = document.getElementById("listaPlanos");
const mensagemLogin = document.getElementById("mensagemLogin");

let idPlanoAtual = null;

// Busca o plano atual do usuário logado (se estiver logado) e depois desenha os cards
function carregarAssinaturas() {

    fetch("/api/planos/atual")
        .then(function(resposta) {
            if (resposta.status === 401) {
                mensagemLogin.style.display = "block";
                idPlanoAtual = null;
                return null;
            }
            return resposta.json();
        })
        .then(function(planoAtual) {
            if (planoAtual) {
                idPlanoAtual = planoAtual.id_plano;
            }
            return fetch("/api/planos").then(function(resposta) { return resposta.json(); });
        })
        .then(function(planos) {
            desenharPlanos(planos);
        })
        .catch(function(erro) {
            console.log("Erro ao carregar planos:", erro);
        });
}

// Monta o HTML de cada card de plano na tela
function desenharPlanos(planos) {

    listaPlanos.innerHTML = "";

    const idsOrdenados = Object.keys(planos).sort(function(a, b) {
        return planos[a].preco - planos[b].preco;
    });

    idsOrdenados.forEach(function(id) {
        const plano = planos[id];

        const card = document.createElement("div");
        card.className = "cardPlano";

        const ehPlanoAtual = (idPlanoAtual === plano.id_plano);
        const ehPremium = (plano.nome === "Premium");

        if (ehPremium) {
            card.classList.add("recomendado");
        }

        const precoFormatado = plano.preco === 0
            ? "R$ 0/mês"
            : "R$ " + plano.preco.toFixed(2).replace(".", ",") + "/mês";

        const listaFeatures = Object.entries(plano.features)
            .filter(function([, liberado]) { return liberado; })
            .map(function([feature]) { return "<li>" + formatarNomeFeature(feature) + "</li>"; })
            .join("");

        card.innerHTML =
            (ehPlanoAtual ? "<span class='badge atual'>Plano atual</span>" : (ehPremium ? "<span class='badge'>Recomendado</span>" : "")) +
            "<h3>" + plano.nome + "</h3>" +
            "<div class='preco'>" + precoFormatado + "</div>" +
            "<ul>" + listaFeatures + "</ul>" +
            "<button class='btnAssinar' data-id-plano='" + plano.id_plano + "'>" +
            (ehPlanoAtual ? "Plano atual" : "Assinar " + plano.nome) +
            "</button>";

        const botao = card.querySelector(".btnAssinar");
        if (ehPlanoAtual) {
            botao.disabled = true;
        } else {
            botao.addEventListener("click", function() {
                assinarPlano(plano.id_plano);
            });
        }

        listaPlanos.appendChild(card);
    });
}

// Deixa o nome da feature mais legível pra mostrar na tela
function formatarNomeFeature(feature) {
    const nomes = {
        dashboard_completo: "Dashboard completo",
        controle_financeiro: "Controle financeiro",
        biblioteca_basica: "Biblioteca básica",
        conteudos_exclusivos: "Conteúdos exclusivos",
        templates_avancados: "Templates e materiais avançados",
        lista_especialistas: "Lista de especialistas parceiros",
        suporte_prioritario: "Suporte prioritário"
    };

    return nomes[feature] || feature;
}

// Envia o pedido pra trocar de plano e recarrega a tela em seguida
function assinarPlano(idPlano) {
    fetch("/api/planos/assinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_plano: idPlano })
    })
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
            if (!dados.sucesso) {
                alert(dados.erro || "Não foi possível assinar o plano.");
                return;
            }
            carregarAssinaturas();
        })
        .catch(function(erro) {
            console.log("Erro ao assinar plano:", erro);
        });
}

carregarAssinaturas();