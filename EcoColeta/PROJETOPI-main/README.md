# EcoColeta

Projeto Interdisciplinar — Fatec

O EcoColeta é um site que ajuda a organizar a coleta de galhos e resíduos de poda na cidade de Matão-SP, facilitando a comunicação entre os moradores e a prefeitura.

Site publicado: https://projetopi-three.vercel.app

## O que o site faz

- Apresenta o projeto e a proposta de organização das rotas de coleta.
- Permite solicitar a coleta por um formulário (nome, telefone, bairro, endereço, tipo de resíduo e volume).
- Gera um número de protocolo para cada pedido.
- Permite consultar o período de coleta de cada bairro.
- Permite acompanhar o andamento do pedido pelo protocolo.

## Estrutura do projeto

```
index.html        página principal
css/style.css     estilos do site
js/script.js      modal, formulário e consultas
imagens/          caminhão, logo e ícone da aba
```

## Tecnologias

- HTML e CSS
- JavaScript (sem bibliotecas)
- Hospedagem na Vercel

## Como rodar

Abrir o arquivo `index.html` no navegador.

## Observações

- Os pedidos ficam salvos no navegador (`localStorage`), pois o projeto ainda não tem servidor nem banco de dados.
- Os períodos de coleta de cada bairro ainda precisam ser confirmados com a prefeitura. Eles ficam no começo do arquivo `js/script.js`.

## Próximos passos

- Banco de dados para guardar os pedidos.
- Painel para a prefeitura atualizar o andamento das coletas.
- Cronograma real de coleta por bairro.
