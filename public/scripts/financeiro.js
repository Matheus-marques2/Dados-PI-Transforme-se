document.addEventListener("DOMContentLoaded", function() {

    const hoje = new Date();

    const selectMes =
        document.getElementById("mes-financeiro");

    const inputAno =
        document.getElementById("ano-financeiro");


    selectMes.value = hoje.getMonth() + 1;

    inputAno.value = hoje.getFullYear();


    carregarFinanceiro();


    selectMes.addEventListener(
        "change",
        function() {
            carregarFinanceiro();
        }
    );


    inputAno.addEventListener(
        "change",
        function() {
            carregarFinanceiro();
        }
    );


    const form =
        document.getElementById("form-movimentacao");


    form.addEventListener(
        "submit",
        adicionarMovimentacao
    );

});


async function carregarFinanceiro() {

    await carregarResumo();

    await carregarMovimentacoes();

}


async function carregarResumo() {

    const mes =
        document.getElementById("mes-financeiro").value;

    const ano =
        document.getElementById("ano-financeiro").value;


    try {

        const resposta = await fetch(
            `/api/financeiro/resumo?mes=${mes}&ano=${ano}`
        );


        if (!resposta.ok) {

            if (resposta.status === 401) {

                mostrarMensagem(
                    "Usuário não autenticado."
                );

                return;
            }


            throw new Error(
                "Erro ao buscar resumo financeiro"
            );

        }


        const dados =
            await resposta.json();


        document
            .getElementById("valor-entradas")
            .textContent =
            formatarDinheiro(dados.entrada);


        document
            .getElementById("valor-saidas")
            .textContent =
            formatarDinheiro(dados.saida);


        document
            .getElementById("valor-lucro")
            .textContent =
            formatarDinheiro(dados.lucro);


        document
            .getElementById("total-movimentado")
            .textContent =
            formatarDinheiro(
                dados.total_movimentado
            );


        document
            .getElementById("percentual-entradas")
            .textContent =
            `${dados.percentual_entradas}%`;


        document
            .getElementById("percentual-saidas")
            .textContent =
            `${dados.percentual_saidas}%`;


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Não foi possível carregar o resumo financeiro."
        );

    }

}


async function carregarMovimentacoes() {

    const mes =
        document.getElementById("mes-financeiro").value;

    const ano =
        document.getElementById("ano-financeiro").value;

    const lista =
        document.getElementById("lista-movimentacoes");


    try {

        const resposta = await fetch(
            `/api/financeiro/movimentacoes?mes=${mes}&ano=${ano}`
        );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar movimentações"
            );

        }


        const movimentacoes =
            await resposta.json();


        lista.innerHTML = "";


        if (movimentacoes.length === 0) {

            lista.innerHTML = `
                <p>
                    Nenhuma movimentação encontrada.
                </p>
            `;

            return;
        }


        movimentacoes.forEach(
            function(movimentacao) {

                const item =
                    document.createElement("article");


                const descricao =
                    document.createElement("span");

                descricao.textContent =
                    movimentacao.descricao;


                const valor =
                    document.createElement("span");


                if (
                    movimentacao.tipo === "entrada"
                ) {

                    valor.textContent =
                        `+ ${formatarDinheiro(
                            movimentacao.valor
                        )}`;

                } else {

                    valor.textContent =
                        `- ${formatarDinheiro(
                            movimentacao.valor
                        )}`;

                }


                const data =
                    document.createElement("span");

                data.textContent =
                    formatarData(
                        movimentacao.data
                    );


                const botaoExcluir =
                    document.createElement("button");

                botaoExcluir.textContent =
                    "Excluir";


                botaoExcluir.addEventListener(
                    "click",
                    function() {

                        excluirMovimentacao(
                            movimentacao.id
                        );

                    }
                );


                item.appendChild(descricao);

                item.appendChild(valor);

                item.appendChild(data);

                item.appendChild(botaoExcluir);


                lista.appendChild(item);

            }
        );


    } catch (erro) {

        console.error(erro);

        lista.innerHTML = `
            <p>
                Não foi possível carregar
                as movimentações.
            </p>
        `;

    }

}


async function adicionarMovimentacao(event) {

    event.preventDefault();


    const dados = {

        descricao:
            document
                .getElementById("descricao")
                .value,

        valor:
            Number(
                document
                    .getElementById("valor")
                    .value
            ),

        tipo:
            document
                .getElementById("tipo")
                .value,

        data:
            document
                .getElementById("data")
                .value

    };


    try {

        const resposta = await fetch(
            "/api/financeiro/movimentacoes",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(dados)
            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            mostrarMensagem(
                resultado.erro ||
                "Erro ao adicionar movimentação."
            );

            return;
        }


        mostrarMensagem(
            "Movimentação adicionada com sucesso."
        );


        document
            .getElementById("form-movimentacao")
            .reset();


        await carregarFinanceiro();


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao adicionar movimentação."
        );

    }

}


async function excluirMovimentacao(id) {

    try {

        const resposta = await fetch(
            `/api/financeiro/movimentacoes/${id}`,
            {
                method: "DELETE"
            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            mostrarMensagem(
                resultado.erro ||
                "Erro ao excluir movimentação."
            );

            return;
        }


        mostrarMensagem(
            "Movimentação excluída."
        );


        await carregarFinanceiro();


    } catch (erro) {

        console.error(erro);

        mostrarMensagem(
            "Erro ao excluir movimentação."
        );

    }

}


function formatarDinheiro(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function formatarData(data) {

    const partes = data.split("-");

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


function mostrarMensagem(mensagem) {

    document
        .getElementById("mensagem-financeiro")
        .textContent = mensagem;

}