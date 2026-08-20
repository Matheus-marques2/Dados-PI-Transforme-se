import { cursos } from "../../database/database.js";

console.log("LISTAR CURSOS CARREGOU");

console.log("CURSOS:", cursos);

const listaCursos = document.getElementById("lista-de-cursos");

Object.values(cursos).forEach(curso =>{
    const card = document.createElement("div");
    card.classList.add("card-curso");

    const titulo = document.createElement("h3");
    titulo.classList.add("titulo-curso");
    titulo.textContent = curso.nome;

    const descricao = document.createElement("p");
    descricao.classList.add("descricao-curso");
    descricao.textContent = curso.descricao;

    const carga_horaria = document.createElement("span");
    carga_horaria.classList.add("carga-horaria-curso");
    carga_horaria.textContent = `Duração: ${curso.carga_horaria}`;

    const preco = document.createElement("span");
    preco.classList.add("preco-curso");
    preco.textContent = `R$: ${curso.preco}`;

    card.appendChild(titulo);
    card.appendChild(descricao);
    card.appendChild(preco);
    card.appendChild(carga_horaria);

    listaCursos.appendChild(card);
})