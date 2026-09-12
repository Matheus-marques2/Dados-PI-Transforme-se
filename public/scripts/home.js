document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarUsuario();

        carregarResumoFinanceiro();

    }
);

function formatarDinheiro(valor) {
    return Number(valor).toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL"}
    );
}


function formatarVariacao(valor) {

    const numero = Number(valor);
    if (numero > 0) {
        return `↑ ${numero}% vs mês anterior`;

    }
    if (numero < 0) {

        return `↓ ${Math.abs(numero)}% vs mês anterior`;

    }
    return "0% vs mês anterior";

}

async function carregarUsuario() {

    try {

        const resposta =
            await fetch("/api/usuario-logado");


        if (!resposta.ok) {
            return;
        }


        const usuario =
            await resposta.json();


        document
            .getElementById("nome-usuario")
            .textContent =
            usuario.nome;


    } catch (erro) {

        console.error(
            "Erro ao carregar usuário:",
            erro
        );

    }

}

async function carregarResumoFinanceiro() {

    try {

        const resposta =
            await fetch(
                "/api/financeiro/resumo"
            );


        if (!resposta.ok) {
            return;
        }


        const dados =
            await resposta.json();


        document
            .getElementById("home-receita")
            .textContent =
            formatarDinheiro(
                dados.entrada
            );


        document
            .getElementById("home-despesas")
            .textContent =
            formatarDinheiro(
                dados.saida
            );


        document
            .getElementById(
                "home-variacao-receita"
            )
            .textContent =
            formatarVariacao(
                dados
                    .comparacao_mes_anterior
                    .entrada
            );


        document
            .getElementById(
                "home-variacao-despesas"
            )
            .textContent =
            formatarVariacao(
                dados
                    .comparacao_mes_anterior
                    .saida
            );


    } catch (erro) {

        console.error(
            "Erro ao carregar resumo:",
            erro
        );

    }

}