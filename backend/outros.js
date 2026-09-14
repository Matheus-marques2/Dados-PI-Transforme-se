// Importando a lib Express para este arquivo e armazenando os seus recursos na constante app
const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");
const { body, validationResult } = require("express-validator");

// Usando a lib path para conseguir utilizar os arquivos locais do sistema como banco de dados em Json e as paginas web criadas
const path = require("path");
const { json } = require("stream/consumers");
const { setDefaultCACertificates } = require("tls");

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


app.get("/assinaturas", function(request, response){
    response.sendFile(path.join(__dirname, "public", "Assinaturas", "assinaturas.html"));
});


app.get("/api/negocio", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const idUsuarioLogado = request.session.usuario.id_usuario;
    const negocio = db.negocios[idUsuarioLogado];

    response.json({
        nome_usuario: request.session.usuario.nome, // vem da sessão, não é editável aqui
        cnpj: negocio ? negocio.cnpj : "",
        nome_negocio: negocio ? negocio.nome_negocio : "",
        situacao: negocio ? negocio.situacao : ""
    });
});

app.get("/api/obrigacoes", function(request, response){
    response.json(db.obrigacoes);
});

app.get("/api/guias", function(request, response){
    response.json(db.guias);
});

app.put("/api/negocio", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }
 
    const { cnpj, nome_negocio, situacao } = request.body;
 
    if(!cnpj || !nome_negocio || !situacao){
        response.status(400).json({ erro: "Preencha CNPJ, nome do negócio e situação" });
        return;
    }
 
    const idUsuarioLogado = request.session.usuario.id_usuario;
 
    db.negocios[idUsuarioLogado] = {
        cnpj: cnpj,
        nome_negocio: nome_negocio,
        situacao: situacao
    };
 
    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );
 
    response.json({ sucesso: true });
});

app.put("/api/obrigacoes/:id", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }
 
    const idObrigacao = request.params.id;
    const obrigacao = db.obrigacoes[idObrigacao];
 
    if(!obrigacao){
        response.status(404).json({ erro: "Obrigação não encontrada" });
        return;
    }
 
    const { status } = request.body;
    const statusValidos = ["Em dia", "Pendente", "Concluida"];
 
    if(!statusValidos.includes(status)){
        response.status(400).json({ erro: "Status inválido" });
        return;
    }
 
    obrigacao.status = status;
 
    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );
 
    response.json({ sucesso: true, obrigacao: obrigacao });
});