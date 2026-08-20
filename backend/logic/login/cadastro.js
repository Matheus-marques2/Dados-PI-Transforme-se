let usuarios = [];

let proximoId = 1;

const formulario = document.getElementById("formCadastro");

formulario.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const sobrenome = document.getElementById("sobrenome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const usuario = {
        id: proximoId,
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        senha: senha
    };


     const emailExiste = usuarios.some(function(usuario) {
        return usuario.email === email;
    });


    if (emailExiste) {

        alert("Este e-mail já está cadastrado!");

        return;
    }

    usuarios.push(usuario);


    proximoId++;


    console.log("Usuário cadastrado:");
    console.log(usuario);

    console.log("Todos os usuários:");
    console.log(usuarios);


    alert("Usuário cadastrado com sucesso!");


    formulario.reset();

});