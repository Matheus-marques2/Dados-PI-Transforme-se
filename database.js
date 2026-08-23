// Dados de Professor (Ewerton)
// id, nome, cpf

export const professores = {
  1:{ id_professor: 1, nome: "Ana Carolina", cpf: "123.456.789-00"},
  2:{ id_professor: 2, nome: "Carlos Eduardo", cpf: "987.654.321-00"},
  3:{ id_professor: 3, nome: "Fernanda Souza", cpf: "456.789.123-00"},
  4:{ id_professor: 4, nome: "Marcos Oliveira", cpf: "321.654.987-00"},
  5:{ id_professor: 5, nome: "Juliana Ferreira", cpf: "741.852.963-00"}
}

// Dados de Cursos (Matheus)
// id, nome, cargahoraria, avaliação, modulo, genero, id_professor, id_usuario, preço e descrição
export const cursos = {
// id_usuarios é uma lista com todos os usuários que compraram aquele curso
  1: {
    id_curso: 1,
    nome: "Como controlar suas finanças",
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
    id_usuarios: [1],
    descricao: "Aprenda a ter controle total do seu dinheiro.",
    preco: "grátis"
  },
  
  2: {
    id_curso: 2,
    nome: "Montando a sua estratégia",
    carga_horaria: 30,
    avaliacao: 4.8,
    modulos: [
    "Fundamentos do Marketing",
    "Público-Alvo e Persona",
    "Estratégia de Marketing Digital",
    "Publicidade e Mídia Paga",
    ],
    genero: "Marketing",
    id_professor: 2,
    id_usuarios: [1],
    descricao: "Aprenda a montar sua estratégia de marketing.",
    preco: "R$ 9,99"
  }
}

// Dados de To Do List (Marcio)
// id_usuario, titulo, descricao
// Dicionário grande de tarefas (To Do List)
export const tarefas = {
  1: {
    id: 1,
    id_usuario: 1,
    titulo: "Atividade física",
    descricao: "Realizar treino de mobilidade e exercícios na academia"
  },

  2: {
    id: 2,
    id_usuario: 2,
    titulo: "Organizar Estoque",
    descricao: ""
  },

  3: {
    id: 3,
    id_usuario: 3,
    titulo: "Praticar desenho",
    descricao: "Fazer estudos de anatomia humana, luz e sombra no papel"
  },

  4: {
    id: 4,
    id_usuario: 4,
    titulo: "Organizar espaço de trabalho",
    descricao: "Limpar a mesa e organizar os materiais de estudo"
  },

  5: {
    id: 5,
    id_usuario: 5,
    titulo: "Revisar código",
    descricao: "Verificar a estrutura do dicionário principal e testar no console"
  },

 6: {
    id: 6,
    id_usuario: 5,
    titulo: "Revisar código",
    descricao: "Verificar a estrutura do dicionário principal e testar no console"
  }
}

