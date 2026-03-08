# API de Pedidos

API REST simples para gerenciar pedidos.

Este projeto foi desenvolvido como parte de um desafio técnico.

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose

## Instalação

Clone o repositório

git clone https://github.com/ItsKevinHere/order-api.git

Instale as dependências

npm install

Execute o projeto

node server.js

O servidor será iniciado em:

http://localhost:3000

## Endpoints

Criar pedido

POST /order

Obter pedido por ID

GET /order/:id

Listar pedidos

GET /order/list

Atualizar pedido

PUT /order/:id

Excluir pedido

DELETE /order/:id
