// Pega a referência do <ul id="listaTarefas"> que está no tarefas.html
const listaTarefas = document.getElementById("listaTarefas");

// Função responsável por buscar as tarefas na API e desenhar elas na tela
function carregarTarefas() {

    fetch("/api/tarefas")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(tarefas) {

            // Limpa a lista antes de redesenhar, evita duplicar itens
            listaTarefas.innerHTML = "";

            tarefas.forEach(function(tarefa) {

                // Cria o <li> da tarefa
                const li = document.createElement("li");

                // Guarda o id da tarefa no próprio elemento, o botão de deletar vai usar isso
                li.dataset.id = tarefa.id;

                // Texto mostrado: título e, se tiver, a descrição
                li.textContent = tarefa.titulo;

                if (tarefa.descricao) {
                    li.textContent += " - " + tarefa.descricao;
                }

                // Cria o botão de apagar dentro do próprio <li>
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

// Assim que a página carrega, já busca as tarefas do usuário
carregarTarefas();
