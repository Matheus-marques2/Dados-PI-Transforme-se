// Usa "delegação de evento": escuta os cliques no <ul> inteiro,
// em vez de colocar um addEventListener em cada botão (que ainda nem existe
// quando a página carrega, já que os <li> são criados depois pelo listar_tarefas.js)
listaTarefas.addEventListener("click", function(evento) {

    // Só continua se quem foi clicado tiver a classe do botão de apagar
    if (!evento.target.classList.contains("btnApagarTarefa")) {
        return;
    }

    // O botão está dentro do <li>, então pegamos o id guardado no <li> pai
    const li = evento.target.closest("li");
    const idTarefa = li.dataset.id;

    fetch("/tarefas/" + idTarefa, {
        method: "DELETE"
    })
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {

            if (!dados.sucesso) {
                alert(dados.erro || "Não foi possível apagar a tarefa.");
                return;
            }

            // Atualiza a lista chamando a função que está em listar_tarefas.js
            carregarTarefas();
        })
        .catch(function(erro) {
            console.log("Erro ao apagar tarefa:", erro);
        });
});
