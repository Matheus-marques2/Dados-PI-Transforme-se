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


app.get("/cursos", function(request,response){
    response.sendFile(path.join(__dirname, "public", "Mentorias", "Cursos", "index.html"));
});

app.get("/mentorias", function(request,response){
    response.sendFile(path.join(__dirname, "public", "Mentorias", "Mentoria", "index.html"));
});

app.get("/api/cursos", function(request, response){
    response.json(db.cursos);
});


app.get("/api/mentorias", function(request, response){
    const mentoriasComProfessor = {};

    Object.entries(db.mentorias).forEach(function([id, mentoria]){
        const professor = db.professores[mentoria.id_professor];

        mentoriasComProfessor[id] = {
            ...mentoria,
            mentor: professor ? professor.nome : "Mentor não encontrado"
        };
    });

    response.json(mentoriasComProfessor);
});

module.exports = app;