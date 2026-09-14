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

app.get("/financeiro", function(request, response){
    response.sendFile(path.join(__dirname, "public", "Financeiro", "VisãoGeral", "index.html"));
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

module.exports = app;