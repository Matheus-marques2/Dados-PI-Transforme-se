const template = document.getElementById("template-obrigacao");
const container = document.getElementById("lista-obrigacoes");
const abas = document.querySelectorAll(".aba");

let todasAsObrigacoes = [];
let filtroAtual = "Todas";

function renderizarObrigacoes() {
    container.innerHTML = "";

    const obrigacoesFiltradas = filtroAtual === "Todas"
        ? todasAsObrigacoes
        : todasAsObrigacoes.filter(obrigacao => obrigacao.status === filtroAtual);

    obrigacoesFiltradas.forEach(obrigacao => {
        const clone = template.content.cloneNode(true);

        clone.querySelector(".card-obrigacao__titulo").textContent = obrigacao.titulo;
        clone.querySelector(".card-obrigacao__status").textContent = obrigacao.status;
        clone.querySelector(".card-obrigacao__vencimento").textContent = `Vencimento: ${obrigacao.vencimento}`;
        clone.querySelector(".card-obrigacao__descricao").textContent = obrigacao.descricao;

        const botaoConcluir = clone.querySelector(".card-obrigacao__concluir");

        // O botão só faz sentido pra quem ainda não concluiu
        if(obrigacao.status === "Concluida"){
            botaoConcluir.remove();
        } else {
            botaoConcluir.addEventListener("click", async function(event){
                // Impede que o clique no botão também dispare o clique do card (que abre o link externo)
                event.stopPropagation();

                const response = await fetch(`/api/obrigacoes/${obrigacao.id_obrigacao}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "Concluida" })
                });

                const resultado = await response.json();

                if(!resultado.sucesso){
                    alert(resultado.erro || "Não foi possível atualizar a obrigação.");
                    return;
                }

                // Atualiza o status na lista em memória e redesenha os cards
                obrigacao.status = "Concluida";
                renderizarObrigacoes();
            });
        }

        // Clicar no card (fora do botão) manda o usuário pro site oficial
        const card = clone.querySelector(".card-obrigacao");
        card.addEventListener("click", function(){
            window.open(obrigacao.link, "_blank");
        });

        container.appendChild(clone);
    });
}

abas.forEach(aba => {
    aba.addEventListener("click", function(){
        filtroAtual = aba.dataset.filtro;

        abas.forEach(a => a.classList.remove("aba--ativa"));
        aba.classList.add("aba--ativa");

        renderizarObrigacoes();
    });
});

async function carregarObrigacoes() {
    const response = await fetch("/api/obrigacoes");
    const obrigacoes = await response.json();

    todasAsObrigacoes = Object.values(obrigacoes);
    renderizarObrigacoes();
}

carregarObrigacoes();