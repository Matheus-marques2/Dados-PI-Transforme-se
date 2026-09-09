const listaTarefas = document.getElementById("listaTarefas");

function carregarTarefas() {

    fetch("/api/tarefas")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(tarefas) {

            listaTarefas.innerHTML = "";

            tarefas.forEach(function(tarefa) {

                const status = tarefa.status || "pendente";

                const li = document.createElement("li");
                li.dataset.id = tarefa.id;
                li.dataset.status = status;
                li.dataset.titulo = tarefa.titulo;
                li.dataset.descricao = tarefa.descricao || "";

                const textoSpan = document.createElement("span");
                textoSpan.classList.add("textoTarefa");
                textoSpan.textContent = tarefa.titulo;

                if (tarefa.descricao) {
                    textoSpan.textContent += " - " + tarefa.descricao;
                }

                if (status === "concluida") {
                    textoSpan.style.textDecoration = "line-through";
                }

                li.appendChild(textoSpan);

                const statusSpan = document.createElement("span");
                statusSpan.classList.add("statusTarefa");
                statusSpan.textContent = " [" + (status === "concluida" ? "Concluída" : "Pendente") + "]";
                li.appendChild(statusSpan);

                const btnStatus = document.createElement("button");
                btnStatus.textContent = status === "concluida" ? "Reabrir" : "Concluir";
                btnStatus.classList.add("btnStatusTarefa");
                li.appendChild(btnStatus);

                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.classList.add("btnEditarTarefa");
                li.appendChild(btnEditar);

                const btnApagar = document.createElement("button");
                btnApagar.textContent = "Apagar";
                btnApagar.classList.add("btnApagarTarefa");
                li.appendChild(btnApagar);

                listaTarefas.appendChild(li);
            });
        })
        .catch(function(erro) {
            console.log("Erro ao carregar tarefas:", erro);
        });
}

carregarTarefas();