// Importando a lib Express para este arquivo e armazenando os seus recursos na constante app
const express = require("express");
const app = express();
const fs = require("fs");
const session = require("express-session");

// Usando a lib path para conseguir utilizar os arquivos locais do sistema como banco de dados em Json e as paginas web criadas
const path = require("path");
const { json } = require("stream/consumers");
const { setDefaultCACertificates } = require("tls");

// Exportando o banco de dados Json
const db = JSON.parse(fs.readFileSync(path.join(__dirname, "db.json")));


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

// ================== Rotas GET para renderizar páginas =======================


// Coloca o arquivo index como rota principal do sistema
app.get("/", function(request, response){
    response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", function(request, response){
    response.sendFile(path.join(__dirname, "public", "pages", "login.html"));

});

app.get("/cadastro", function(request, response){
    response.sendFile(path.join(__dirname, "public", "pages", "cadastro.html"));
});

app.get("/cursos", function(request,response){
    response.sendFile(path.join(__dirname, "public", "pages", "cursos.html"));
});

app.get("/perfil", function(request, response){
    response.sendFile(path.join(__dirname, "public", "pages", "perfil.html"));
});

app.get("/api/cursos", function(request, response){
    response.json(db.cursos);
});

//Rota de api para o front consumir e conseguir ver se o user está logado
app.get("/api/usuario-logado", function(request, response){
    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }
    response.json(request.session.usuario);
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
})



// ================== Rotas para POST =======================

app.post("/cadastro", function(request, response){
    const {nome, sobrenome, email, senha} = request.body;
    
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

app.post("/login", function(request, response) {

    const { emailDigitado, senhaDigitada } = request.body;

    // tem que localizar o usuario pelo o email 
    const usuario = db.usuarios[emailDigitado.trim().toLowerCase()];

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
        email: emailDigitado
    }

    // Login correto
    response.send("Login realizado com sucesso!");
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
        descricao: descricao || ""
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

// ================== Rotas para PUT =======================

app.put("/api/perfil", function(request, response){
    if(!request.session.usuario){
        response.status(400).json({erro: "Não autenticado"})
        return;
    }

    const emailAtual = request.session.usuario.email;
    const usuario = db.usuarios[emailAtual];

    const {nome, pronome, email, sobre, numero, cnpj} = request.body;
    const novoEmail = email.trim().toLowerCase();

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

// Sobe o servidor na porta 3000
// para acessar execute "node server.js" no terminal
// use CTRL + Click no link gerado ou abra o localhost:3000 no seu navegador
app.listen(3000, function(){
    console.log("Servidor rodando no endereco: http://localhost:3000");
});