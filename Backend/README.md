# ApiMobile
Aplicativo em desenvolvimento

## Estrutura de pastas

Separado por pastas para que o projeto fique mais organizado, e de fácil entendimento.

- `src/models`: define os esquemas do banco (MongoDB), como `User`, `Pet`, `Service`.
- `src/controllers`: contem a regra de cada funcionalidade (login, pets, servicos, etc.).
- `src/routes`: define os endpoints da API e encaminha para os controllers.
- `src/middlewares`: funcoes que rodam no meio da requisicao (autenticacao, validacao, upload, tratamento de erro).
- `src/validators`: regras de validacao de entrada.
- `src/config`: configuracoes auxiliares.
- `src/docs`: documentacao da API no Swagger.
- `uploads`: arquivos enviados pelo sistema (fotos dos pets).

Essa separacao ajuda porque cada parte do codigo tem um papel claro, ficando mais facil testar, corrigir e evoluir no desenvolvimento do projeto.
