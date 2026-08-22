// Importando a lib Express para este arquivo e armazenando os seus recursos na constante app
const express = require("express");
const app = express();

// Usando a lib path para conseguir utilizar os arquivos locais do sistema como banco de dados em Json e as paginas web criadas
const path = require("path");

// Da acesso a pasta public ao express para receber recursos de estilizacao e script como css e js
app.use(express.static(
    path.join(__dirname, "public")
));

// Coloca o arquivo index como rota principal do sistema
app.get("/", function(request, response){
    response.sendFile(path.join(__dirname, "public", "index.html"));
});

// Sobe o servidor na porta 3000
// para acessar execute "node server.js" no terminal
// use CTRL + Click no link gerado ou abra o localhost:3000 no seu navegador
app.listen(3000, function(){
    console.log("Servidor rodando no endereco: http://localhost:3000");
});