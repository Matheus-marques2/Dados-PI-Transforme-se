// DOM para pagina de cadastro
document.querySelector("form").addEventListener("submit", async(event) => {

    event.preventDefault();

    const formData = new FormData(event.target);
    const dados = Object.fromEntries(formData);

    const response = await fetch("/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    const resultado = await response.json();

    const mensagem = document.getElementById("mensagem");

    if(!resultado.sucesso) {
        mensagem.textContent = "E-mail já cadastrado!";
        mensagem.style.color = "red";
        return
    }
    
    mensagem.textContent = "E-mail cadastrado com sucesso!";
    mensagem.style.color = "green";
});