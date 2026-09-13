// ================= Meu negócio =================

const cardNegocio = document.getElementById("cardNegocio");
const formNegocio = document.getElementById("formNegocio");

// Guarda os dados carregados pra poder preencher o formulário quando o usuário clicar em "Editar"
let dadosNegocioAtual = {};

function preencherCard(dados) {
    cardNegocio.querySelector(".card-negocio__usuario").textContent = `Dono: ${dados.nome_usuario}`;
    cardNegocio.querySelector(".card-negocio__nome").textContent = `Negócio: ${dados.nome_negocio || "Não informado"}`;
    cardNegocio.querySelector(".card-negocio__cnpj").textContent = `CNPJ: ${dados.cnpj || "Não informado"}`;
    cardNegocio.querySelector(".card-negocio__situacao").textContent = `Situação: ${dados.situacao || "Não informado"}`;
}

async function carregarNegocio() {
    const response = await fetch("/api/negocio");
    const dados = await response.json();

    if(!response.ok){
        document.getElementById("negocioMensagem").textContent = dados.erro || "Não foi possível carregar seus dados.";
        return;
    }

    dadosNegocioAtual = dados;
    preencherCard(dados);
}

// Clicar em "Editar informações" abre o formulário já preenchido com o que existe hoje
document.getElementById("btnEditarNegocio").addEventListener("click", function(){
    document.querySelector('[name="nome_negocio"]').value = dadosNegocioAtual.nome_negocio || "";
    document.querySelector('[name="cnpj"]').value = dadosNegocioAtual.cnpj || "";
    document.querySelector('[name="situacao"]').value = dadosNegocioAtual.situacao || "";

    cardNegocio.hidden = true;
    formNegocio.hidden = false;
});

// Cancelar fecha o formulário sem salvar nada
document.getElementById("btnCancelarEdicao").addEventListener("click", function(){
    formNegocio.hidden = true;
    cardNegocio.hidden = false;
});

formNegocio.addEventListener("submit", async function(event){
    event.preventDefault();

    const corpo = {
        cnpj: document.querySelector('[name="cnpj"]').value,
        nome_negocio: document.querySelector('[name="nome_negocio"]').value,
        situacao: document.querySelector('[name="situacao"]').value
    };

    const response = await fetch("/api/negocio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    });

    const resultado = await response.json();
    const mensagemEl = document.getElementById("negocioMensagem");

    if(!resultado.sucesso){
        mensagemEl.textContent = resultado.erro || "Erro ao salvar os dados.";
        return;
    }

    mensagemEl.textContent = "Dados salvos com sucesso!";

    // Atualiza o card com os dados novos e volta pra visualização
    dadosNegocioAtual = { ...dadosNegocioAtual, ...corpo };
    preencherCard(dadosNegocioAtual);

    formNegocio.hidden = true;
    cardNegocio.hidden = false;
});

// ================= Prévia de obrigações =================

async function carregarObrigacoesPreview() {
    const response = await fetch("/api/obrigacoes");
    const obrigacoes = await response.json();

    const template = document.getElementById("template-obrigacao-preview");
    const container = document.getElementById("lista-obrigacoes-preview");

    Object.values(obrigacoes).forEach(obrigacao => {
        const clone = template.content.cloneNode(true);

        clone.querySelector(".card-obrigacao__titulo").textContent = obrigacao.titulo;
        clone.querySelector(".card-obrigacao__status").textContent = obrigacao.status;
        clone.querySelector(".card-obrigacao__vencimento").textContent = `Vencimento: ${obrigacao.vencimento}`;

        const link = clone.querySelector(".card-obrigacao__link");
        link.href = obrigacao.link;

        container.appendChild(clone);
    });
}

carregarNegocio();
carregarObrigacoesPreview();
