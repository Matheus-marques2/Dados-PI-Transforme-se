import { usuarios } from "../../database/database.js";

// Logica para logar no sistema

const formulario = document.querySelector("form");

formulario.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const senha = document.querySelector("#senha").value;

    const usuario = usuarios[email];

    if (!usuario) {
        alert("E-mail não cadastrado!");
        return;
    }

    if (usuario.senha !== senha) {
        alert("Senha incorreta!");
        return;
    }

    sessionStorage.setItem("id_usuario", usuario.id_usuario);
    sessionStorage.setItem("nome_usuario", usuario.nome);

    alert(`Bem-vindo, ${usuario.nome}!`);

    window.location.href = "exibir_saldos.html";
});


// Logica para exibir usuario logado

const nomeUsuario = sessionStorage.getItem("nome_usuario");

if (nomeUsuario) {
    console.log(`Usuário logado: ${nomeUsuario}`);
}