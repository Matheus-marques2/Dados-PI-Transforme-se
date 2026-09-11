async function carregarResumo() {

const resposta = await fetch(
    "/api/financeiro/resumo"
);

const dados = await resposta.json();

document.getElementById("resumo").textContent =
    JSON.stringify(dados, null, 4);
}

async function carregarMovimentacoes() {

const resposta = await fetch(
    "/api/financeiro/movimentacoes"
);

const dados = await resposta.json();

document.getElementById("movimentacoes").textContent =
    JSON.stringify(dados, null, 4);
}


document.getElementById("formFinanceiro").addEventListener("submit", async function(event) {

    event.preventDefault();


    const dados = {

        descricao:
            document.getElementById("descricao").value,

        valor:
            Number(document.getElementById("valor").value),

        tipo:
            document.getElementById("tipo").value,

        data:
            document.getElementById("data").value
    };


    const resposta = await fetch(
        "/api/financeiro/movimentacoes",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dados)
        }
    );


    const resultado = await resposta.json();
    alert(JSON.stringify(resultado));

    carregarResumo();
    carregarMovimentacoes();

});
