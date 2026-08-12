




// Dados de usuarios (Sabrina)
// id, email, senha, nome





// Dados de saldo (Carlos)
// id_usuario, id, saldo_total, entradas, saidas, despesas, receita
const saldos = {
    // a chave principal de busca é o id_usuario
    1: {
        id: 1,
        saldo_total: 1000,
        entradas: [["Pix Antonio", 100], ["Pix Josefina", 54]],
        saidas: [["Pagamento DAS", 82]],
        despesas: 0,
        receita: 0
    },
    
    2: {
        id: 2,
        saldo_total: 500,
        entradas: [],
        saidas: [],
        despesas: 0,
        receita: 0
    }
}


// Dados de Professor (Ewerton)
// id, nome, cpf





// Dados de Cursos (Matheus)
// id, nome, cargahoraria, avaliação, modulo, genero, id_professor, id_usuario
const cursos = {
// id_usuarios é uma lista com todos os usuários que compraram aquele curso
    1: {
        id_curso: 1,
        nome: "Introdução a Conceitos de Finanças",
        carga_horaria: 60,
        avaliacao: 4.5,
        modulos: [
        "Introdução à Finanças",
        "Educação Financeira",
        "Investimentos",
        "Mercado Financeiro",
        "Análise de Risco"
        ],
        genero: "Finanças",
        id_professor: 1,
        id_usuarios: [1]
    },
    
    2: {
        id_curso: 2,
        nome: "Empreendedorismo para Pequenos Négocios",
        carga_horaria: 80,
        avaliacao: 4.8,
        modulos: [
        "Introdução ao Empreendedorismo",
        "Plano de Negócios",
        "Marketing para Empreendedores",
        "Gestão de Pequenos Negócios",
        ],
        genero: "Empreendedorismo",
        id_professor: 2,
        id_usuarios: [1]
    }
}




// Dados de To Do List (Marcio)
// id_usuario, titulo, descricao





