// page/ajuda.js
// Lógica da Central de Ajuda: categorias, busca de perguntas frequentes e tickets de suporte

// Lista todas as categorias de ajuda (Minha conta, Financeiro, Meu MEI, etc)
function listarCategorias(db) {
    return Object.values(db.categoriasAjuda);
}

// Lista as perguntas frequentes. Se idCategoria for passado, filtra só daquela categoria
function listarPerguntas(db, idCategoria) {
    const perguntas = Object.values(db.perguntasFrequentes);

    if (!idCategoria) {
        return perguntas;
    }

    return perguntas.filter(function(pergunta) {
        return pergunta.id_categoria === Number(idCategoria);
    });
}

// Busca perguntas frequentes por um termo digitado (procura tanto na pergunta quanto na resposta)
function buscarPerguntas(db, termo) {
    const termoNormalizado = termo.trim().toLowerCase();

    if (!termoNormalizado) {
        return [];
    }

    const perguntas = Object.values(db.perguntasFrequentes);

    return perguntas.filter(function(pergunta) {
        const perguntaNormalizada = pergunta.pergunta.toLowerCase();
        const respostaNormalizada = pergunta.resposta.toLowerCase();

        return perguntaNormalizada.includes(termoNormalizado) || respostaNormalizada.includes(termoNormalizado);
    });
}

// Cria um novo ticket de suporte pro usuário logado
function criarTicket(db, idUsuario, assunto, mensagem) {
    const tickets = Object.values(db.tickets);

    let maiorId = 0;
    tickets.forEach(function(ticket) {
        if (ticket.id > maiorId) {
            maiorId = ticket.id;
        }
    });

    const novoId = maiorId + 1;

    const novoTicket = {
        id: novoId,
        id_usuario: idUsuario,
        assunto: assunto,
        mensagem: mensagem,
        status: "aberto",
        data_abertura: new Date().toISOString()
    };

    db.tickets[novoId] = novoTicket;

    return novoTicket;
}

// Lista só os tickets do usuário logado (ninguém vê ticket de outra pessoa)
function listarTicketsDoUsuario(db, idUsuario) {
    return Object.values(db.tickets).filter(function(ticket) {
        return ticket.id_usuario === idUsuario;
    });
}

module.exports = {
    listarCategorias,
    listarPerguntas,
    buscarPerguntas,
    criarTicket,
    listarTicketsDoUsuario
};