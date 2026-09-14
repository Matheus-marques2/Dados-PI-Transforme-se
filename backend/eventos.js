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


// Rotas de Calendário (eventos por dia)

// Lista os eventos do usuário logado. Aceita filtro opcional por mês/ano:
// GET /api/eventos?mes=9&ano=2026
app.get("/api/eventos", function(request, response){

    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const idUsuarioLogado = request.session.usuario.id_usuario;
    const { mes, ano } = request.query;

    let eventosDoUsuario = Object.values(db.eventos).filter(function(evento) {
        return evento.id_usuario === idUsuarioLogado;
    });

    if (mes && ano) {
        eventosDoUsuario = eventosDoUsuario.filter(function(evento) {
            const [anoEvento, mesEvento] = evento.data.split("-");
            return Number(mesEvento) === Number(mes) && Number(anoEvento) === Number(ano);
        });
    }

    response.json(eventosDoUsuario);
});

// Cria um novo evento marcado em uma data (formato AAAA-MM-DD)
app.post("/eventos", function(request, response){

    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const { data, titulo, descricao } = request.body;

    if(!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)){
        response.status(400).json({ erro: "Informe uma data válida no formato AAAA-MM-DD" });
        return;
    }

    if(!titulo){
        response.status(400).json({ erro: "O título do evento é obrigatório" });
        return;
    }

    const eventos = Object.values(db.eventos);

    let maiorId = 0;
    eventos.forEach(function(evento) {
        if (evento.id > maiorId) {
            maiorId = evento.id;
        }
    });

    const novoId = maiorId + 1;

    const novoEvento = {
        id: novoId,
        id_usuario: request.session.usuario.id_usuario,
        data: data,
        titulo: titulo,
        descricao: descricao || ""
    };

    db.eventos[novoId] = novoEvento;

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    response.json({
        sucesso: true,
        evento: novoEvento
    });
});

// Edita data, título e/ou descrição de um evento
app.put("/eventos/:id", function(request, response){

    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const idEvento = request.params.id;
    const evento = db.eventos[idEvento];

    if(!evento){
        response.status(404).json({ erro: "Evento não encontrado" });
        return;
    }

    if(evento.id_usuario !== request.session.usuario.id_usuario){
        response.status(403).json({ erro: "Esse evento não pertence a você" });
        return;
    }

    const { data, titulo, descricao } = request.body;

    if(data !== undefined){
        if(!/^\d{4}-\d{2}-\d{2}$/.test(data)){
            response.status(400).json({ erro: "Data inválida, use o formato AAAA-MM-DD" });
            return;
        }
        evento.data = data;
    }

    if(titulo !== undefined){
        if(!titulo.trim()){
            response.status(400).json({ erro: "O título do evento é obrigatório" });
            return;
        }
        evento.titulo = titulo;
    }

    if(descricao !== undefined){
        evento.descricao = descricao;
    }

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    response.json({
        sucesso: true,
        evento: evento
    });
});

// Apaga um evento
app.delete("/eventos/:id", function(request, response){

    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const idEvento = request.params.id;
    const evento = db.eventos[idEvento];

    if(!evento){
        response.status(404).json({ erro: "Evento não encontrado" });
        return;
    }

    if(evento.id_usuario !== request.session.usuario.id_usuario){
        response.status(403).json({ erro: "Esse evento não pertence a você" });
        return;
    }

    delete db.eventos[idEvento];

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    response.json({ sucesso: true });
});

module.exports = app;