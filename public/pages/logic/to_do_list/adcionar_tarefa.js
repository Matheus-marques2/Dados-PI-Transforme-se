// Pega as referências do input de texto e do botão de adicionar
const inputTarefa = document.getElementById("inputTarefa");
const btnAdcionar = document.getElementById("btnAdcionar");

// Escuta o clique no botão "Adcinar Tarefa"
btnAdcionar.addEventListener("click", function() {

    const titulo = inputTarefa.value.trim();

    // Não deixa mandar tarefa vazia pra API
    if (!titulo) {
        alert("Digite uma tarefa antes de adicionar.");
        return;
    }

    fetch("/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo: titulo })
    })
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {

            if (!dados.sucesso) {
                alert(dados.erro || "Não foi possível adicionar a tarefa.");
                return;
            }

            // Limpa o input depois de adicionar
            inputTarefa.value = "";

            // Atualiza a lista chamando a função que está em listar_tarefas.js
            carregarTarefas();
        })
        .catch(function(erro) {
            console.log("Erro ao adicionar tarefa:", erro);
        });
});
