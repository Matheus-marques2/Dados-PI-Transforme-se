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

// ================== Rotas GET para renderizar páginas =======================


// Coloca o arquivo index como rota principal do sistema
app.get("/home", function(request, response){
    response.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", function(request, response){
    response.sendFile(path.join(__dirname, "public", "auth", "login", "index.html"));
});

app.get("/cadastro", function(request, response){
    response.sendFile(path.join(__dirname, "public", "auth", "cadastro", "index.html"));
});

app.get("/cursos", function(request,response){
    response.sendFile(path.join(__dirname, "public", "Mentorias", "Cursos", "index.html"));
});

app.get("/mentorias", function(request,response){
    response.sendFile(path.join(__dirname, "public", "Mentorias", "Mentoria", "index.html"));
});

app.get("/perfil", function(request, response){
    response.sendFile(path.join(__dirname, "public", "Menu", "InformaçõesPessoais", "index.html"));
});

app.get("/financeiro", function(request, response){
    response.sendFile(path.join(__dirname, "public", "Financeiro", "VisãoGeral", "index.html"));
});

app.get("/tarefas", function(request, response){
    response.sendFile(path.join(__dirname, "public", "Atividades", "VisãoGeral", "index.html"));
});
// adicionei 
app.get("/configuracoes", function(request, response){
    response.sendFile(path.join(__dirname, "public", "Configuração", "configuracoes.html"));
});

app.get("/obrigacoes", function(request, response){
    response.sendFile(path.join(__dirname, "public", "MeuMei", "obrigacoes", "index.html"));
});

app.get("/guias", function(request, response){
    response.sendFile(path.join(__dirname, "public", "MeuMei", "guias", "index.html"));
});

app.get("/visaoGeral", function(request, response){
    response.sendFile(path.join(__dirname, "public", "MeuMei", "visaoGeral", "index.html"));
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

// Rotas Financeiro

// Retorna o resumo financeiro do usuário logado.
// Pode receber mês e ano:
// GET /api/financeiro/resumo?mes=8&ano=2026
app.get("/api/financeiro/resumo", function(request, response) {

    if (!request.session.usuario) {
        response.status(401).json({
            erro: "Não autenticado"
        });
        return;
    }

    const idUsuario = request.session.usuario.id_usuario;

    const hoje = new Date();

    const mes = request.query.mes
        ? Number(request.query.mes)
        : hoje.getMonth() + 1;

    const ano = request.query.ano
        ? Number(request.query.ano)
        : hoje.getFullYear();


    if (mes < 1 || mes > 12 || !Number.isInteger(mes)) {
        response.status(400).json({
            erro: "Mês inválido"
        });
        return;
    }

    if (!Number.isInteger(ano)) {
        response.status(400).json({
            erro: "Ano inválido"
        });
        return;
    }


    const movimentacoes = Object.values(db.movimentacoes || {});

    // Movimentações apenas do usuário logado
    const movimentacoesUsuario = movimentacoes.filter(function(movimentacao) {
        return movimentacao.id_usuario === idUsuario;
    });


    // Filtra mês solicitado
    const movimentacoesMes = movimentacoesUsuario.filter(function(movimentacao) {

        const [anoMovimento, mesMovimento] = movimentacao.data
            .split("-")
            .map(Number);

        return anoMovimento === ano && mesMovimento === mes;
    });


    let entradas = 0;
    let saidas = 0;

    movimentacoesMes.forEach(function(movimentacao) {

        if (movimentacao.tipo === "entrada") {
            entradas += Number(movimentacao.valor);
        }

        if (movimentacao.tipo === "saida") {
            saidas += Number(movimentacao.valor);
        }

    });


    const lucro = entradas - saidas;

    const totalMovimentado = entradas + saidas;

    let percentualEntradas = 0;
    let percentualSaidas = 0;

    if (totalMovimentado > 0) {
        percentualEntradas = (entradas / totalMovimentado) * 100;
        percentualSaidas = (saidas / totalMovimentado) * 100;
    }


    response.json({
        mes: mes,
        ano: ano,

        entrada: entradas,
        saida: saidas,
        lucro: lucro,

        total_movimentado: totalMovimentado,

        percentual_entradas: Number(percentualEntradas.toFixed(2)),
        percentual_saidas: Number(percentualSaidas.toFixed(2))
    });

});

app.delete("/api/financeiro/movimentacoes/:id", function(request, response) {

    if (!request.session.usuario) {
        response.status(401).json({
            erro: "Não autenticado"
        });
        return;
    }

    const id = request.params.id;
    const movimentacao = db.movimentacoes?.[id];


    if (!movimentacao) {
        response.status(404).json({
            erro: "Movimentação não encontrada"
        });
        return;
    }


    if (movimentacao.id_usuario !== request.session.usuario.id_usuario) {
        response.status(403).json({
            erro: "Essa movimentação não pertence a você"
        });
        return;
    }

    delete db.movimentacoes[id];
    salvarBanco();

    response.json({
        sucesso: true
    });

});

app.get("/api/financeiro/movimentacoes", function(request, response) {

    if (!request.session.usuario) {
        response.status(401).json({
            erro: "Não autenticado"
        });
        return;
    }

    const idUsuario = request.session.usuario.id_usuario;

    const { mes, ano, tipo } = request.query;

    let movimentacoes = Object.values(db.movimentacoes || {});

    // Somente movimentações do usuário logado
    movimentacoes = movimentacoes.filter(function(movimentacao) {
        return movimentacao.id_usuario === idUsuario;
    });


    // Filtra por tipo, caso seja informado
    if (tipo) {

        if (tipo !== "entrada" && tipo !== "saida") {
            response.status(400).json({
                erro: "Tipo inválido. Use 'entrada' ou 'saida'"
            });
            return;
        }

        movimentacoes = movimentacoes.filter(function(movimentacao) {
            return movimentacao.tipo === tipo;
        });
    }


    // Filtra mês e ano
    if (mes && ano) {

        movimentacoes = movimentacoes.filter(function(movimentacao) {

            const [anoMovimento, mesMovimento] = movimentacao.data
                .split("-")
                .map(Number);

            return (
                anoMovimento === Number(ano) &&
                mesMovimento === Number(mes)
            );
        });

    }


    // Mais recentes primeiro
    movimentacoes.sort(function(a, b) {
        return new Date(b.data) - new Date(a.data);
    });


    response.json(movimentacoes);
});

app.post("/api/financeiro/movimentacoes", function(request, response) {

    if (!request.session.usuario) {
        response.status(401).json({
            erro: "Não autenticado"
        });
        return;
    }


    const { descricao, valor, tipo, data } = request.body;


    if (!descricao || !descricao.trim()) {
        response.status(400).json({
            erro: "A descrição é obrigatória"
        });
        return;
    }


    const valorNumero = Number(valor);

    if (!valorNumero || valorNumero <= 0) {
        response.status(400).json({
            erro: "Informe um valor maior que zero"
        });
        return;
    }


    if (tipo !== "entrada" && tipo !== "saida") {
        response.status(400).json({
            erro: "O tipo deve ser 'entrada' ou 'saida'"
        });
        return;
    }


    if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        response.status(400).json({
            erro: "Informe uma data no formato AAAA-MM-DD"
        });
        return;
    }


    if (!db.movimentacoes) {
        db.movimentacoes = {};
    }


    const movimentacoes = Object.values(db.movimentacoes);

    let maiorId = 0;

    movimentacoes.forEach(function(movimentacao) {
        if (movimentacao.id > maiorId) {
            maiorId = movimentacao.id;
        }
    });


    const novoId = maiorId + 1;


    const novaMovimentacao = {
        id: novoId,
        id_usuario: request.session.usuario.id_usuario,
        descricao: descricao.trim(),
        valor: valorNumero,
        tipo: tipo,
        data: data
    };


    db.movimentacoes[novoId] = novaMovimentacao;


    salvarBanco();


    response.status(201).json({
        sucesso: true,
        movimentacao: novaMovimentacao
    });

});

// ================== Rotas para POST =======================

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
        descricao: descricao || "",
        status: "pendente"
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

// Atualiza título, descrição e/ou status de uma tarefa (edição do CRUD)
app.put("/tarefas/:id", function(request, response){

    if(!request.session.usuario){
        response.status(401).json({ erro: "Não autenticado" });
        return;
    }

    const idTarefa = request.params.id;
    const tarefa = db.tarefas[idTarefa];

    if(!tarefa){
        response.status(404).json({ erro: "Tarefa não encontrada" });
        return;
    }

    if(tarefa.id_usuario !== request.session.usuario.id_usuario){
        response.status(403).json({ erro: "Essa tarefa não pertence a você" });
        return;
    }

    const { titulo, descricao, status } = request.body;

    if(titulo !== undefined){
        if(!titulo.trim()){
            response.status(400).json({ erro: "O título da tarefa é obrigatório" });
            return;
        }
        tarefa.titulo = titulo;
    }

    if(descricao !== undefined){
        tarefa.descricao = descricao;
    }

    if(status !== undefined){
        if(status !== "pendente" && status !== "concluida"){
            response.status(400).json({ erro: "Status inválido, use 'pendente' ou 'concluida'" });
            return;
        }
        tarefa.status = status;
    }

    fs.writeFileSync(
        path.join(__dirname, "db.json"),
        JSON.stringify(db, null, 4)
    );

    response.json({
        sucesso: true,
        tarefa: tarefa
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



// Rotas de Planos/Assinaturas

// Lista todos os planos disponíveis (pública, pra tela de Assinaturas)
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

app.get("/assinaturas", function(request, response){
    response.sendFile(path.join(__dirname, "public", "pages", "assinaturas.html"));
});
// Sobe o servidor na porta 3000
// para acessar execute "node server.js" no terminal
// use CTRL + Click no link gerado ou abra o localhost:3000 no seu navegador
app.listen(3000, function(){
    console.log("Servidor rodando no endereco: http://localhost:3000/login");
});