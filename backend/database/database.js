




// Dados de usuarios (Sabrina)
// id, email, senha, nome

const usuarios = [
    { id: "1" ,email: "sabrina@gmail.com", nome: "Sabrina Barros", senha: "123456" },
    { id: "2", email: "carlos@gmail.com", nome: "Carlos Henrique", senha: "123456" },
    { id: "3", email: "marcio@gmail.com", nome: "Marcio Eduardo", senha: "123456" },
    { id: "4", email: "ewerton@gmail.com", nome: "Ewerton Henrique", senha: "123456" },
    { id: "5", email: "matheus@gmail.com", nome: "Matheus Marques", senha: "123456" }
];




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
// Dicionário grande de tarefas (To Do List)
const tarefas = {
  tarefa_1: {
    id: 1,
    id_usuario: 1,
    titulo: "Atividade física",
    descricao: "Realizar treino de mobilidade e exercícios na academia"
  },
  tarefa_2: {
    id: 2,
    id_usuario: 2,
    titulo: "Organizar Estoque",
    descricao: ""
  },
  tarefa_3: {
    id: 3,
    id_usuario: 3,
    titulo: "Praticar desenho",
    descricao: "Fazer estudos de anatomia humana, luz e sombra no papel"
  },
  tarefa_4: {
    id: 4,
    id_usuario: 4,
    titulo: "Organizar espaço de trabalho",
    descricao: "Limpar a mesa e organizar os materiais de estudo"
  },
  tarefa_5: {
    id: 5,
    id_usuario: 5,
    titulo: "Revisar código",
    descricao: "Verificar a estrutura do dicionário principal e testar no console"
  }
};
 tarefa_6: {
    id: 6,
    id_usuario: 5,
    titulo: "Revisar código",
    descricao: "Verificar a estrutura do dicionário principal e testar no console"
  }
};



