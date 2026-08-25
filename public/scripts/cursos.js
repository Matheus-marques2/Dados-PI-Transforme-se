async function exibirCursos() {
    const response = await fetch("/api/cursos");
    const cursos = await response.json();

    const container = document.getElementById("lista-de-cursos");

    Object.values(cursos).forEach(curso => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h2>${curso.nome}</h2>
            <p>${curso.descricao}</p>
            <p>Carga horária: ${curso.carga_horaria}h — Avaliação: ${curso.avaliacao}</p>
        `;
        container.appendChild(div);
    });
}

exibirCursos();