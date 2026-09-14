// Importando a lib Express para este arquivo e armazenando os seus recursos na constante app
const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const { body, validationResult } = require("express-validator");

// Usando a lib path para conseguir utilizar os arquivos locais do sistema como banco de dados em Json e as paginas web criadas
const path = require("path");

// Exportando o banco de dados Json
const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));

function salvarBanco() {
    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );
}

// Da acesso a pasta public ao express para receber recursos de estilizacao e script como css e js
app.use(express.static(
    path.join(__dirname, "public")
));

// Interpletar dados dos formulários
app.use(express.urlencoded( {extended: true} ));

app.use(express.json());

// ================== MIDLEWARE para configurar sessão =======================

app.use(session({
    secret: "palavra-chave",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false,
        maxAge: 1000 * 60 * 60
    }
}))


app.get("/tarefas", function(request, response){
    response.sendFile(path.join(__dirname, "public", "Atividades", "VisãoGeral", "index.html"));
});

app.post("/tarefas", function(request, response){

    // Só deixa criar tarefa se o usuário estiver logado
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const { titulo, descricao } = request.body;

    if(!titulo){
        response.status(400).json({ erro: "O título da tarefa é obrigatório" });
        return;
    }

    const tarefas = Object.values(db.tarefas);

    let maiorId = 0;

    tarefas.forEach(function(tarefa) {
        if (tarefa.id > maiorId) {
            maiorId = tarefa.id;
        }
    });

    const novoId = maiorId + 1;

    const novaTarefa = {
        id: novoId,
        id_usuario: request.session.usuario.id_usuario,
        titulo: titulo,
        descricao: descricao || "",
        status: "pendente"
    };

    db.tarefas[novoId] = novaTarefa;

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    response.json({
        sucesso: true,
        tarefa: novaTarefa
    });

});

// Rota de api para o front buscar somente as tarefas do usuário que está logado
app.get("/api/tarefas", function(request, response){

    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const idUsuarioLogado = request.session.usuario.id_usuario;

    const todasTarefas = Object.values(db.tarefas);

    const tarefasDoUsuario = todasTarefas.filter(function(tarefa) {
        return tarefa.id_usuario === idUsuarioLogado;
    });

    response.json(tarefasDoUsuario);
});

app.delete("/tarefas/:id", function(request, response){

    // Só deixa apagar tarefa se o usuário estiver logado
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const idTarefa = request.params.id;

    const tarefa = db.tarefas[idTarefa];

    // Verifica se a tarefa existe
    if(!tarefa){
        response.status(404).json({ erro: "Tarefa não encontrada" });
        return;
    }

    // Verifica se a tarefa pertence ao usuário logado (ninguém apaga tarefa de outra pessoa)
    if(tarefa.id_usuario !== request.session.usuario.id_usuario){
        response.status(403).json({ erro: "Essa tarefa não pertence a você" });
        return;
    }

    delete db.tarefas[idTarefa];

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    response.json({
        sucesso: true
    });

});

// Atualiza título, descrição e/ou status de uma tarefa (edição do CRUD)
app.put("/tarefas/:id", function(request, response){

    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const idTarefa = request.params.id;
    const tarefa = db.tarefas[idTarefa];

    if(!tarefa){
        response.status(404).json({ erro: "Tarefa não encontrada" });
        return;
    }

    if(tarefa.id_usuario !== request.session.usuario.id_usuario){
        response.status(403).json({ erro: "Essa tarefa não pertence a você" });
        return;
    }

    const { titulo, descricao, status } = request.body;

    if(titulo !== undefined){
        if(!titulo.trim()){
            response.status(400).json({ erro: "O título da tarefa é obrigatório" });
            return;
        }
        tarefa.titulo = titulo;
    }

    if(descricao !== undefined){
        tarefa.descricao = descricao;
    }

    if(status !== undefined){
        if(status !== "pendente" && status !== "concluida"){
            response.status(400).json({ erro: "Status inválido, use 'pendente' ou 'concluida'" });
            return;
        }
        tarefa.status = status;
    }

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    response.json({
        sucesso: true,
        tarefa: tarefa
    });

});

module.exports = app;