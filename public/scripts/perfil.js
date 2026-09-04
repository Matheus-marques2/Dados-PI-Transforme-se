async function carregarPerfil() {
    const response = await fetch("/api/perfil");
    const dados = await response.json();

    document.querySelector('[name="nome"]').value = dados.nome;
    document.querySelector('[name="email"]').value = dados.email;
    document.querySelector('[name="pronome"]').value = dados.pronome;
    document.querySelector('[name="numero"]').value = dados.numero;
    document.querySelector('[name="sobre"]').value = dados.sobre;
}

document.getElementById("btnSalvar").addEventListener("click", async function(){
    const corpo = {
        nome: document.querySelector('[name="nome"]').value,
        email: document.querySelector('[name="email"]').value,
        pronome: document.querySelector('[name="pronome"]').value,
        numero: document.querySelector('[name="numero"]').value,
        sobre: document.querySelector('[name="sobre"]').value
    };

    const response = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    });

    const resultado = await response.json();

    if(resultado.sucesso){
        alert("Perfil atualizado com sucesso!");
    } else {
        alert(resultado.erro || "Erro ao atualizar perfil.");
    }
});

carregarPerfil();