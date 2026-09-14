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


app.get("/perfil", function(request, response){
    response.sendFile(path.join(__dirname, "public", "Menu", "InformaçõesPessoais", "index.html"));
});

app.get("/api/perfil", function(request,response){
    if(!request.session.usuario){
        response.status(401).json({erro: "Não autenticado"});
        return;
    }

    const usuario = db.usuarios[request.session.usuario.email];

    if(!usuario){
        response.status(404).json({erro: "Usuário não encontrado"});
        return;
    }

    response.json({
        nome: usuario.nome,
        email: request.session.usuario.email,
        pronome: usuario.pronome || "",
        cnpj: usuario.cnpj || "",
        sobre: usuario.sobre || "",
        numero: usuario.numero
    })
});


app.put("/api/perfil", function(request, response){
    if(!request.session.usuario){
        response.status(400).json({erro: "Não autenticado"})
        return;
    }

    const emailAtual = request.session.usuario.email;
    const usuario = db.usuarios[emailAtual];

    const {nome, pronome, email, sobre, numero, cnpj} = request.body;

    //valida presença e tipo ANTES de chamar .trim() (antes disso,
    // e-mail ausente/undefined derrubava o servidor com erro 500)
    if(typeof email !== "string" || !email.trim()){
        response.status(400).json({erro: "O e-mail é obrigatório"});
        return;
    }
    
    const novoEmail = email.trim().toLowerCase();

    // valida o FORMATO do e-mail antes de trocar a chave do usuário
    // e gravar (normalizar caixa/espaços não garante que seja um e-mail válido)
    const formatoDeEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(novoEmail);
    if(!formatoDeEmailValido){
        response.status(400).json({erro: "Informe um e-mail em um formato válido"});
        return;
    }

    if(novoEmail !== emailAtual){
        if(db.usuarios[novoEmail]){
            response.status(401).json({erro: "Email já está sendo utilizado."});
            return;
        }

        delete db.usuarios[emailAtual];
        db.usuarios[novoEmail] = usuario;
    }

    //atualiza os campos no obejto
    usuario.nome = nome;
    usuario.sobre = sobre;
    usuario.numero = numero;
    usuario.cnpj = cnpj;
    usuario.pronome = pronome;

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    //mantém a sessão atual com os dados novos
    request.session.usuario.nome = nome;
    request.session.usuario.email = novoEmail;

    response.json({sucesso: true});
})

module.exports = app;