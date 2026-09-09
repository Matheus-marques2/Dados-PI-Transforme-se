const template = document.getElementById("template-mentoria");
 
async function exibirMentorias() {
    const response = await fetch("/api/mentorias");
    const mentorias = await response.json();
 
    const container = document.getElementById("lista-de-mentorias");
 
    Object.values(mentorias).forEach(mentoria => {
        const clone = template.content.cloneNode(true);
 
        const imagem = clone.querySelector(".card-mentoria__imagem");
        imagem.src = `/images/mentorias/${mentoria.imagem}`;
        imagem.alt = mentoria.mentor;
 
        clone.querySelector(".card-mentoria__titulo").textContent = mentoria.titulo;
        clone.querySelector(".card-mentoria__mentor").textContent = `Com ${mentoria.mentor}`;
        clone.querySelector(".card-mentoria__info").textContent = `⭐ ${mentoria.avaliacao} — ${mentoria.modalidade}`;
 
        container.appendChild(clone);
    });
}
 
exibirMentorias();