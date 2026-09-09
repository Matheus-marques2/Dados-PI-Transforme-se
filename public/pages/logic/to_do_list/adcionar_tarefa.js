const inputTarefa = document.getElementById("inputTarefa");
const inputDescricao = document.getElementById("inputDescricao"); // NOVO
const btnAdcionar = document.getElementById("btnAdcionar");

btnAdcionar.addEventListener("click", function() {

    const titulo = inputTarefa.value.trim();
    const descricao = inputDescricao.value.trim(); // NOVO

    if (!titulo) {
        alert("Digite uma tarefa antes de adicionar.");
        return;
    }

    fetch("/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: titulo, descricao: descricao }) // ALTERADO (antes só tinha titulo)
    })
        .then(function(resposta) { return resposta.json(); })
        .then(function(dados) {
            if (!dados.sucesso) {
                alert(dados.erro || "Não foi possível adicionar a tarefa.");
                return;
            }
            inputTarefa.value = "";
            inputDescricao.value = ""; // NOVO
            carregarTarefas();
        })
        .catch(function(erro) {
            console.log("Erro ao adicionar tarefa:", erro);
        });
});