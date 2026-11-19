# EcoColeta — Projeto Unificado

Versão que reúne a página original, o preenchimento pelo ViaCEP, os cartões "Como usar" e o painel demonstrativo.

## Como abrir
Abra **index.html** no navegador. Para acessar o painel, clique em **Painel de gestão** no menu (ou abra admin.html). Mantenha todas as pastas no mesmo local.

## Funcionalidades
- Busca de CEP no ViaCEP com preenchimento de rua e bairro (requer internet).
- Solicitação de coleta e protocolo salvo no localStorage.
- Consulta por bairro e número do protocolo.
- Painel demonstrativo com listagem, busca, filtro, atualização de status e criação/remoção de rotas.
- O painel e a página principal compartilham os dados **somente no mesmo navegador e origem**.

## Limitações
É um protótipo sem autenticação ou banco de dados. **Não utilize dados pessoais reais.** Dados não são compartilhados entre dispositivos. Os períodos de coleta ainda não foram confirmados com a prefeitura. As rotas são cadastros de planejamento, sem cálculo automático de percurso.

## Arquivos
- index.html / admin.html
- css/style.css / css/admin.css
- js/script.js / js/admin.js
- imagens/
