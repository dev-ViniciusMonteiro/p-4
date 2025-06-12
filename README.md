# Módulo de Sessões

Este módulo é responsável pelo gerenciamento de sessões de atendimento da clínica psicológica.

## Funcionalidades

- Cadastro de sessões com data, horário e tipo
- Registro de evolução das sessões
- Listagem de sessões com paginação e filtros
- Visualização de sessões por paciente
- Atualização de dados da sessão
- Exclusão de sessões

## Endpoints da API

- `POST /api/sessoes` - Criar nova sessão
- `GET /api/sessoes` - Listar sessões (com paginação e filtros)
- `GET /api/sessoes/paciente/:pacienteId` - Listar sessões de um paciente
- `GET /api/sessoes/:id` - Obter sessão por ID
- `PUT /api/sessoes/:id` - Atualizar sessão
- `DELETE /api/sessoes/:id` - Excluir sessão
- `POST /api/sessoes/:id/evolucao` - Registrar evolução de uma sessão

## Configuração

1. Instale as dependências:
```
npm install
```

2. Configure o arquivo `.env` na raiz do módulo:
```
# Banco de dados
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=clinica_psicologica
DB_PORT=3306

# Servidor
PORT=3002
NODE_ENV=development

# Segurança
JWT_SECRET=sua_chave_secreta
CORS_ORIGIN=*

# Serviços
AUTH_SERVICE_URL=http://localhost:3000/api/auth
```

3. Inicie o servidor:
```
npm run dev
```

## Dependências

- Express: Framework web
- MySQL2: Cliente MySQL
- Axios: Cliente HTTP para comunicação com outros módulos
- Winston: Sistema de logs
- Dotenv: Carregamento de variáveis de ambiente
- Helmet: Segurança HTTP
- CORS: Configuração de Cross-Origin Resource Sharing

## Autenticação

Todas as rotas deste módulo requerem autenticação via token JWT.
O token deve ser enviado no header Authorization:

```
Authorization: Bearer <seu_token_jwt>
```

O módulo se comunica com o serviço de autenticação (moduloLogin) para validar os tokens.