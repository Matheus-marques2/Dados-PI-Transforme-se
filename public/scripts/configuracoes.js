// TEMA CLARO / ESCURO // 
console.log("configuracoes.js carregado!");
const tema = document.getElementById("tema");

tema.addEventListener("change", function () {

    if (tema.value === "escuro") {
        document.body.classList.add("tema-escuro");
    } else {
        document.body.classList.remove("tema-escuro");
    }

});