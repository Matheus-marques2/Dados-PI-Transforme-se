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

app.get("/login", function(request, response){
    response.sendFile(path.join(__dirname, "..", "public", "auth", "login", "index.html"));
});


app.post("/login", function(request, response) {

    const { emailDigitado, senhaDigitada } = request.body;

    // Normaliza o e-mail UMA vez e usa esse mesmo valor pra localizar
    // o usuário e pra guardar na sessão (evita divergência com o perfil)
    const emailNormalizado = emailDigitado.trim().toLowerCase();
    
    // tem que localizar o usuario pelo o email 
    const usuario = db.usuarios[emailNormalizado];

    console.log(usuario);

    // vai verifica se a pessoa existe
    if (!usuario) {
        response.send("Email inválido");
        return;
    }

    // aqui verfifica a senha do usuario
    if (usuario.senha !== senhaDigitada) {
        response.send("Senha incorreta");
        return;
    }

    //armazena os dados do usuário logado na sessão
    request.session.usuario = {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: emailNormalizado
    }

    // Login correto
    response.send("Login realizado com sucesso!");
});

//Rota de api para o front consumir e conseguir ver se o user está logado
app.get("/api/usuario-logado", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }
    response.json(request.session.usuario);
});

module.exports = app;