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

app.get("/cadastro", function(request, response){
    response.sendFile(path.join(__dirname, "public", "auth", "cadastro", "index.html"));
});

app.post("/cadastro", [
    body("nome").notEmpty().withMessage("Nome é um campo obrigatório, preencha-o."),
    body("sobrenome").notEmpty().withMessage("Sobrenome é um campo obrigatório, preencha-o."),
    body("senha").notEmpty().withMessage("Senha é um campo obrigatório, preencha-o."),
    body("email").isEmail().withMessage("Nome é um campo obrigatório, preencha-o."),
], function(request, response){
    const {nome, sobrenome, email, senha} = request.body;
    
    const errors = validationResult(request);

    if(!errors.isEmpty()){
        return response.status(400).json({errors: errors.array()});
    }

    if(db.usuarios[email.trim().toLowerCase()]){
            response.json({
                sucesso: false
            });

        return;
    }

    const usuarios = Object.values(db.usuarios);

    let maiorId = 0;

    usuarios.forEach(function(usuario) {
        if (usuario.id_usuario > maiorId) {
            maiorId = usuario.id_usuario;
        }
    });

    db.usuarios[email.trim().toLowerCase()] = {
        id_usuario: maiorId + 1,
        nome: nome,
        sobrenome: sobrenome,
        senha: senha
    }

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );
    
    response.json({
        sucesso: true
    });

});

module.exports = app;