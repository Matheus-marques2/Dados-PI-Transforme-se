DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(20) UNIQUE NOT NULL,
    senha VARCHAR(10) NOT NULL
);

INSERT INTO usuarios (nome, email, senha) VALUES
('Carlos Henrique', 'carl@email.com', '123456'),
('Sabrina Barros', 'sabrina@email.com', '123456'),
('Matheus Marques', 'matheus@email.com', '123456'),
('Ewerton Henrique', 'ewerton@email.com', '123456'),
('Marcio Eduardo', 'marcio@email.com', '123456');