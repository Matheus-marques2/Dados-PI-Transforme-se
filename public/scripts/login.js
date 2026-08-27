// Seleciona o formulário da página de cadastro e adiciona um listener para o evento "submit"
document.querySelector("form").addEventListener("submit", async(event) =>{

    // Evita que o formulário seja enviado de forma padrão (carregamento de página)
    event.preventDefault();

    //Pega os valores de emailDigitado e senhaDigitada
    const email = document.getElementsByName("emailDigitado")[0].value;
    const senha = document.getElementsByName("senhaDigitada")[0].value;

    // Faz uma requisição POST para a rota /login e envia os dados em formato JSON
    const response = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({emailDigitado: email, senhaDigitada: senha}),
        credentials: "include"
        })

    //pega a resposta do server.js armazena numa varíavel e depois coloca a resposta na div loginMensagem
    const text = await response.text();
    document.getElementById("loginMensagem").innerText = text;  

    //Caso o login seja efeituado com sucesso envia o user logado para página principal
    //está enviando para cursos apenas para realização de testes, já que a página principal ainda não foi feita.
    if(text.includes("sucesso!")){
        window.location.href = "/cursos";
    }
})