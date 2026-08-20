document.getElementById('btnAdcionar').addEventListener('click',function(){
  const input = document.getElemtById('inputTarefa');
  const textoTarefa = input.value.trim();
  if (textoTarefa === ''){
    alert('Por favor, digite uma tarefa válida.');
    return;
  }
  //Chama a função de redenrizar que estará disponivel globalmente no projeto 
  adcionarTarefaNaLista(textoTarefa);
  //Limpa o campo
  input.Value = '';
});
