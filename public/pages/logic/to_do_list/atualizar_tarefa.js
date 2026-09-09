listaTarefas.addEventListener("click", function(evento) {

    const li = evento.target.closest("li");
    if (!li) return;

    const idTarefa = li.dataset.id;

    if (evento.target.classList.contains("btnStatusTarefa")) {

        const statusAtual = li.dataset.status;
        const novoStatus = statusAtual === "concluida" ? "pendente" : "concluida";

        fetch("/tarefas/" + idTarefa, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus })
        })
            .then(function(resposta) { return resposta.json(); })
            .then(function(dados) {
                if (!dados.sucesso) {
                    alert(dados.erro || "Não foi possível atualizar o status.");
                    return;
                }
                carregarTarefas();
            })
            .catch(function(erro) {
                console.log("Erro ao atualizar status:", erro);
            });

        return;
    }

    if (evento.target.classList.contains("btnEditarTarefa")) {

        const novoTitulo = prompt("Editar título:", li.dataset.titulo);
        if (novoTitulo === null) return;

        if (!novoTitulo.trim()) {
            alert("O título não pode ficar vazio.");
            return;
        }

        const novaDescricao = prompt("Editar descrição (opcional):", li.dataset.descricao);

        fetch("/tarefas/" + idTarefa, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                titulo: novoTitulo,
                descricao: novaDescricao === null ? li.dataset.descricao : novaDescricao
            })
        })
            .then(function(resposta) { return resposta.json(); })
            .then(function(dados) {
                if (!dados.sucesso) {
                    alert(dados.erro || "Não foi possível editar a tarefa.");
                    return;
                }
                carregarTarefas();
            })
            .catch(function(erro) {
                console.log("Erro ao editar tarefa:", erro);
            });
    }
});