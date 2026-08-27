const template = document.getElementById("template-curso");

async function exibirCursos() {
    const response = await fetch("/api/cursos");
    const cursos = await response.json();

    const container = document.getElementById("lista-de-cursos");

    Object.values(cursos).forEach(curso => {
        const clone = template.content.cloneNode(true);

        const imagem = clone.querySelector(".card-curso__imagem");
        imagem.src = `/images/cursos/${curso.imagem}`;
        imagem.widht = 200;
        imagem.alt = curso.nome;
        
        clone.querySelector(".card-curso__titulo").textContent = curso.nome;
        clone.querySelector(".card-curso__descricao").textContent = curso.descricao;
        clone.querySelector(".card-curso__info").textContent = `Carga horária: ${curso.carga_horaria} — Preço: ${curso.preco}`;

        container.appendChild(clone);
})
}

exibirCursos();