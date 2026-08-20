function vincularEventoDletar(botão, elementoLi) {
  botao.addEventListener('click', function () {
    elementoLi.remove();//Remove o elemento <li> do DOM
  });
}
