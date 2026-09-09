const corpoCalendario = document.getElementById("corpoCalendario");
const tituloMesAno = document.getElementById("tituloMesAno");
const btnMesAnterior = document.getElementById("btnMesAnterior");
const btnProximoMes = document.getElementById("btnProximoMes");

const painelDia = document.getElementById("painelDia");
const tituloDiaSelecionado = document.getElementById("tituloDiaSelecionado");
const listaEventosDia = document.getElementById("listaEventosDia");
const inputTituloEvento = document.getElementById("inputTituloEvento");
const inputDescricaoEvento = document.getElementById("inputDescricaoEvento");
const btnAdicionarEvento = document.getElementById("btnAdicionarEvento");

const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const hoje = new Date();
let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();
let diaSelecionado = null;
let eventosDoMes = [];

function doisDigitos(numero) {
    return String(numero).padStart(2, "0");
}

function formatarData(ano, mesIndexZero, dia) {
    return ano + "-" + doisDigitos(mesIndexZero + 1) + "-" + doisDigitos(dia);
}

function carregarCalendario() {
    return fetch("/api/eventos?mes=" + (mesAtual + 1) + "&ano=" + anoAtual)
        .then(function(resposta) { return resposta.json(); })
        .then(function(eventos) {
            eventosDoMes = eventos;
            desenharCalendario();
        })
        .catch(function(erro) {
            console.log("Erro ao carregar eventos:", erro);
        });
}

function desenharCalendario() {

    tituloMesAno.textContent = nomesMeses[mesAtual] + " de " + anoAtual;
    corpoCalendario.innerHTML = "";

    const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
    const totalDiasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

    let diaAtual = 1;
    let linha = document.createElement("tr");

    for (let i = 0; i < primeiroDiaSemana; i++) {
        linha.appendChild(document.createElement("td"));
    }

    while (diaAtual <= totalDiasNoMes) {

        if (linha.children.length === 7) {
            corpoCalendario.appendChild(linha);
            linha = document.createElement("tr");
        }

        const dataDaCelula = formatarData(anoAtual, mesAtual, diaAtual);

        const celula = document.createElement("td");
        celula.textContent = diaAtual;
        celula.dataset.data = dataDaCelula;
        celula.classList.add("diaCalendario");

        const temEvento = eventosDoMes.some(function(evento) {
            return evento.data === dataDaCelula;
        });

        if (temEvento) celula.classList.add("diaComEvento");
        if (dataDaCelula === diaSelecionado) celula.classList.add("diaSelecionado");

        linha.appendChild(celula);
        diaAtual++;
    }

    while (linha.children.length < 7) {
        linha.appendChild(document.createElement("td"));
    }
    corpoCalendario.appendChild(linha);
}

corpoCalendario.addEventListener("click", function(evento) {
    if (!evento.target.classList.contains("diaCalendario")) return;
    diaSelecionado = evento.target.dataset.data;
    desenharCalendario();
    abrirPainelDoDia();
});

function abrirPainelDoDia() {

    painelDia.style.display = "block";
    tituloDiaSelecionado.textContent = "Eventos em " + diaSelecionado;
    listaEventosDia.innerHTML = "";

    const eventosDoDia = eventosDoMes.filter(function(evento) {
        return evento.data === diaSelecionado;
    });

    eventosDoDia.forEach(function(evento) {

        const li = document.createElement("li");
        li.dataset.id = evento.id;
        li.textContent = evento.titulo;
        if (evento.descricao) li.textContent += " - " + evento.descricao;

        const btnApagar = document.createElement("button");
        btnApagar.textContent = "Apagar";
        btnApagar.classList.add("btnApagarEvento");
        li.appendChild(btnApagar);

        listaEventosDia.appendChild(li);
    });
}

btnAdicionarEvento.addEventListener("click", function() {

    if (!diaSelecionado) {
        alert("Clique em um dia do calendário antes de adicionar um evento.");
        return;
    }

    const titulo = inputTituloEvento.value.trim();
    const descricao = inputDescricaoEvento.value.trim();

    if (!titulo) {
        alert("Digite um título para o evento.");
        return;
    }

    fetch("/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: diaSelecionado, titulo: titulo, descricao: descricao })
    })
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
            if (!dados.sucesso) {
                alert(dados.erro || "Não foi possível adicionar o evento.");
                return;
            }
            inputTituloEvento.value = "";
            inputDescricaoEvento.value = "";
            carregarCalendario().then(function() { abrirPainelDoDia(); });
        })
        .catch(function(erro) {
            console.log("Erro ao adicionar evento:", erro);
        });
});

listaEventosDia.addEventListener("click", function(evento) {

    if (!evento.target.classList.contains("btnApagarEvento")) return;

    const li = evento.target.closest("li");
    const idEvento = li.dataset.id;

    fetch("/eventos/" + idEvento, { method: "DELETE" })
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
            if (!dados.sucesso) {
                alert(dados.erro || "Não foi possível apagar o evento.");
                return;
            }
            carregarCalendario().then(function() { abrirPainelDoDia(); });
        })
        .catch(function(erro) {
            console.log("Erro ao apagar evento:", erro);
        });
});

btnMesAnterior.addEventListener("click", function() {
    mesAtual--;
    if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
    diaSelecionado = null;
    painelDia.style.display = "none";
    carregarCalendario();
});

btnProximoMes.addEventListener("click", function() {
    mesAtual++;
    if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
    diaSelecionado = null;
    painelDia.style.display = "none";
    carregarCalendario();
});

carregarCalendario();