# Transforme-se Projeto Integrador

Projeto desenvolvido para fins de estudo, utilizando HTML, JavaScript e Node.js.

## Tecnologias

* HTML
* JavaScript
* Node.js
* Express

```
## Estrutura do projeto

```text
Dados-PI-Transforme-se/


├── public/
│   ├── index.html
│   │
│   ├── pages/
│   │   ├── cadastro.html
│   │   ├── cursos.html
│   │   ├── login.html
│   │   ├── saldos.html
│   │   └── tarefas.html
│   │
│   └── scripts/
│       ├── cadastro.js
│       ├── cursos.js
│       └── login.js
│
├── db.json
├── .gitignore
├── README.md
├── server.js
├── package.json
└── package-lock.json
```

### Organização das pastas

A pasta `public/` contém os arquivos acessíveis pelo navegador.

* `index.html`: página inicial da aplicação.
* `pages/`: contém as demais páginas do sistema.
* `scripts/`: contém os arquivos JavaScript responsáveis pelas funcionalidades das páginas e manipulação com DOM.

Na raiz do projeto:

* `server.js`: configura e executa o servidor da aplicação.
* `db.json`: contém os arquivos responsáveis pelo armazenamento e manipulação dos dados.
* `package.json`: contém as informações do projeto e suas dependências.
* `package-lock.json`: registra as versões exatas das dependências instaladas.
* `.gitignore`: define quais arquivos e diretórios não devem ser enviados ao Git.
* `README.md`: contém a documentação e as instruções de utilização do projeto.


## Pré-requisitos

É necessário ter o Node.js instalado.

Verifique a instalação:

```bash
node -v
```

```bash
npm -v
```
Caso **não** tenha:

1. Acesse o site oficial:

[Download do Node.js](https://nodejs.org/pt/download/current/?utm_source=chatgpt.com)

2. Baixe a versão **LTS** para Windows.
3. Selecione o instalador **Windows Installer (.msi)**.
4. Execute o arquivo baixado.
5. Siga as etapas do instalador mantendo as opções padrão.
6. Após a instalação, abra o terminal e verifique:

## Instalação do projeto via terminal

Com o git instalado, clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta do projeto (ou abra no VScode):

```bash
cd Dados-PI-Transforme-se
```

Instale as dependências:

```bash
npm install
```

## Executando o projeto

Inicie o servidor:

```bash
node server.js
```

Após iniciar, acesse:

```text
http://localhost:3000
```

## Observação

A pasta `public` contém os arquivos acessíveis pelo navegador, enquanto `backend` contém a lógica e os dados utilizados pelo sistema. 
