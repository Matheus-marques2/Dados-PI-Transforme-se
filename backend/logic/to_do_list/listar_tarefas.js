function adcionarTarefaNaLista(texto) {
  const ul = document.getElementById('listaTarefas');
  const li = documento.createElement('li');
  li.innerHTML = `
    <span>${texto}</span>
    <button class="btn-deletar">Deletar</button>  
`;

//Adciona a tarefa dentro do elemento <ul>
  ul.appendChild(li);
//Vincule o evento de deleção no botão recém-criado
  const btnDeletar = li.querySelector('.btn-deletar');
  vincularEventoDeletar(btnDeletar, li);
}
