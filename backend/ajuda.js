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
    path.join(__dirname, "..", "public")
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

// Rotas da Central de Ajuda

const { listarCategorias, listarPerguntas, buscarPerguntas, criarTicket, listarTicketsDoUsuario } = require("./public/scripts/ajuda");
 
app.get("/api/ajuda/categorias", function(request, response){
    response.json(listarCategorias(db));
});
 
app.get("/api/ajuda/perguntas", function(request, response){
    const { categoria } = request.query;
    response.json(listarPerguntas(db, categoria));
});
 
app.get("/api/ajuda/busca", function(request, response){
    const { q } = request.query;
 
    if(!q){
        response.status(400).json({ erro: "Informe o termo de busca no parâmetro q" });
        return;
    }
 
    response.json(buscarPerguntas(db, q));
});
 
app.post("/api/ajuda/tickets", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }
 
    const { assunto, mensagem } = request.body;
 
    if(!assunto || !assunto.trim()){
        response.status(400).json({ erro: "O assunto do ticket é obrigatório" });
        return;
    }
 
    if(!mensagem || !mensagem.trim()){
        response.status(400).json({ erro: "A mensagem do ticket é obrigatória" });
        return;
    }
 
    const novoTicket = criarTicket(db, request.session.usuario.id_usuario, assunto, mensagem);
 
    fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(db, null, 4));
 
    response.json({ sucesso: true, ticket: novoTicket });
});
 
app.get("/api/ajuda/tickets", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }
 
    response.json(listarTicketsDoUsuario(db, request.session.usuario.id_usuario));
});

module.exports = app;