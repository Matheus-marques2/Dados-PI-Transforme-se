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


// Rotas de Planos/Assinaturas

// Lista todos os planos disponíveis (pública, pra tela de Assinaturas)

const { pegarPlanoDoUsuario, usuarioTemAcesso, exigirFeature } = require("./public/scripts/planos");

app.get("/api/planos", function(request, response){
    response.json(db.planos);
});

// Retorna o plano do usuário logado + suas features
app.get("/api/planos/atual", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const plano = pegarPlanoDoUsuario(db, request.session.usuario.id_usuario);
    response.json(plano);
});

// "Assina" um plano novo pro usuário logado
app.post("/api/planos/assinar", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const { id_plano } = request.body;

    if(!db.planos[id_plano]){
        response.status(400).json({ erro: "Plano inválido" });
        return;
    }

    const emailUsuario = request.session.usuario.email;
    db.usuarios[emailUsuario].id_plano = Number(id_plano);

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    response.json({
        sucesso: true,
        plano: db.planos[id_plano]
    });
});

module.exports = app;