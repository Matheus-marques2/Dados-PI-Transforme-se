// Seleciona o formulário da página de cadastro e adiciona um listener para o evento "submit"
document.querySelector("form").addEventListener("submit", async (event) => {

    // Evita que o formulário seja enviado de forma padrão (carregamento de página)
    event.preventDefault();

    // Cria um objeto FormData com os dados preenchidos no formulário
    const formData = new FormData(event.target);

    // Converte o FormData em um objeto JS simples
    const dados = Object.fromEntries(formData);

    // Faz uma requisição POST para a rota /cadastro enviando os dados em formato JSON
    const response = await fetch("/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    // Converte a resposta do servidor para JSON
    const resultado = await response.json();

    // Seleciona o elemento que exibirá mensagens de feedback para o usuário
    const mensagem = document.getElementById("mensagem");

    // Se o servidor retornou sucesso = false, significa que o e-mail já existe
    if (!resultado.sucesso) {
        mensagem.textContent = "E-mail já cadastrado!";
        mensagem.style.color = "red";
        return;
    }
    
    // Caso contrário, o cadastro foi realizado com sucesso
    mensagem.textContent = "E-mail cadastrado com sucesso!";
    mensagem.style.color = "green";

    // Redireciona o usuário para a página de login
    window.location.href = "/login";
});
