// Importando a lib Express para este arquivo e armazenando os seus recursos na constante app
const express = require("express");
const app = express();
const fs = require("fs");

// Usando a lib path para conseguir utilizar os arquivos locais do sistema como banco de dados em Json e as paginas web criadas
const path = require("path");
const { json } = require("stream/consumers");

// Exportando o banco de dados Json
const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));


// Da acesso a pasta public ao express para receber recursos de estilizacao e script como css e js
app.use(express.static(
    path.join(__dirname, "public")
));

// Interpletar dados dos formulários
app.use(express.urlencoded( {extended: true} ));

app.use(express.json());

// ================== Rotas GET para renderizar páginas =======================


// Coloca o arquivo index como rota principal do sistema
app.get("/", function(request, response){
    response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", function(request, response){
    response.sendFile(path.join(__dirname, "public", "pages", "login.html"));

});

app.post("/login", function(request, response) {

    const { emailDigitado, senhaDigitada } = request.body;

    // tem que localizar o usuario pelo o email 
    const usuario = db.usuarios[emailDigitado];

    console.log(usuario);

    // vai verifica se a pessoa existe
    if (!usuario) {
        response.send("Email inválidos");
        return;
    }

    console.log(senhaDigitada);

    // aqui verfifica a senha do usuario
    if (usuario.senha !== senhaDigitada) {
        response.send("Senha incorreta");
        return;
    }

    // Login correto
    response.send("Login realizado com sucesso!");
});

app.get("/cadastro", function(request, response){
    response.sendFile(path.join(__dirname, "public", "pages", "cadastro.html"));
});

app.get("/cursos", function(request,response){
    response.sendFile(path.join(__dirname, "public", "pages", "cursos.html"));
});

app.get("/api/cursos", function(request, response){
    response.json(db.cursos);
});

// ================== Rotas para POST =======================

app.post("/cadastro", function(request, response){
    const {nome, sobrenome, email, senha} = request.body;
    
    if(db.usuarios[email]){
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

    db.usuarios[email] = {
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

// Sobe o servidor na porta 3000
// para acessar execute "node server.js" no terminal
// use CTRL + Click no link gerado ou abra o localhost:3000 no seu navegador
app.listen(3000, function(){
    console.log("Servidor rodando no endereco: http://localhost:3000");
});