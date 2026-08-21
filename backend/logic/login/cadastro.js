import { usuarios } from "../../database/database.js";

const formulario = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagemCadastro");

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.style.display = "block";
    mensagem.style.padding = "12px";
    mensagem.style.marginTop = "15px";
    mensagem.style.borderRadius = "8px";
    mensagem.style.fontWeight = "bold";

    if (tipo === "sucesso") {
        mensagem.style.backgroundColor = "#d1fae5";
        mensagem.style.color = "#065f46";
        mensagem.style.border = "1px solid #10b981";
    } else {
        mensagem.style.backgroundColor = "#fee2e2";
        mensagem.style.color = "#991b1b";
        mensagem.style.border = "1px solid #ef4444";
    }
}

function buscarUsuarioCadastrado(email) {
    const usuarioBanco = usuarios[email];

    if (usuarioBanco) {
        return usuarioBanco;
    }

    const id = localStorage.getItem(`usuario_${email}_id`);

    if (!id) {
        return null;
    }

    return {
        id_usuario: id,
        nome: localStorage.getItem(`usuario_${email}_nome`),
        senha: localStorage.getItem(`usuario_${email}_senha`)
    };
}

function gerarProximoId() {
    const idsBanco = Object.values(usuarios).map(function(usuario) {
        return Number(usuario.id_usuario);
    });

    const maiorIdBanco = Math.max(...idsBanco);
    const ultimoIdCriado = Number(localStorage.getItem("ultimo_id_usuario")) || maiorIdBanco;

    return Math.max(maiorIdBanco, ultimoIdCriado) + 1;
}

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;

    if (buscarUsuarioCadastrado(email)) {
        mostrarMensagem("Este e-mail já possui cadastro. Você já pode entrar.", "erro");
        return;
    }

    const idUsuario = gerarProximoId();
    const nomeCompleto = `${nome} ${sobrenome}`.trim();

    const novoUsuario = {
        id_usuario: String(idUsuario),
        nome: nomeCompleto,
        senha: senha
    };

    // Adiciona na mesma estrutura importada do database.js enquanto a página está aberta.
    usuarios[email] = novoUsuario;

    // Salva os campos separadamente no navegador
    // Assim o login consegue encontrar o cadastro mesmo depois de trocar de página.
    localStorage.setItem(`usuario_${email}_id`, novoUsuario.id_usuario);
    localStorage.setItem(`usuario_${email}_nome`, novoUsuario.nome);
    localStorage.setItem(`usuario_${email}_senha`, novoUsuario.senha);
    localStorage.setItem("ultimo_id_usuario", String(idUsuario));

    mostrarMensagem("Cadastro realizado com sucesso! Agora você pode entrar na sua conta.", "sucesso");

    formulario.reset();

    setTimeout(function() {
        window.location.href = "login.html";
    }, 1200);
});