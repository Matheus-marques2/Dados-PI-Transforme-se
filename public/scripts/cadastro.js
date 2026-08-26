// DOM para pagina de cadastro

const formulario = document.getElementById("formCadastro");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    cadastrar();

});


async function cadastrar() {

    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch("/cadastro", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nome,
            sobrenome,
            email,
            senha
        })

    });

    const resultado = await resposta.json();

    const mensagem = document.getElementById("mensagem");

    if (resultado.sucesso) {

        mensagem.textContent = "E-mail cadastrado com sucesso!";
        mensagem.style.color = "green";

    } else {

        mensagem.textContent = "E-mail já cadastrado!";
        mensagem.style.color = "red";

    }

}