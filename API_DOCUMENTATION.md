# Documentação da API de Sessões

Esta documentação descreve as rotas disponíveis na API do Módulo de Sessões, suas funcionalidades, parâmetros e exemplos de uso.

## Base URL

```
http://localhost:3002
```

## Autenticação

Todas as rotas requerem autenticação via token JWT. O token deve ser enviado no header `Authorization` com o prefixo `Bearer`.

```
Authorization: Bearer seu_token_jwt_aqui
```

## Rotas Disponíveis

### 1. Listar Sessões

**Endpoint:** `GET /api/sessoes`

**Descrição:** Lista todas as sessões com paginação e filtros opcionais.

**Parâmetros de Query:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Quantidade de itens por página (padrão: 10)
- `paciente_id` (opcional): Filtrar por ID do paciente
- `data_inicio` (opcional): Filtrar por data inicial (formato: YYYY-MM-DD)
- `data_fim` (opcional): Filtrar por data final (formato: YYYY-MM-DD)

**Exemplo de Requisição:**
```
GET /api/sessoes?page=1&limit=10&paciente_id=1&data_inicio=2023-06-01&data_fim=2023-06-30
```

### 2. Criar Sessão

**Endpoint:** `POST /api/sessoes`

**Descrição:** Cria uma nova sessão para um paciente.

**Corpo da Requisição:**
```json
{
    "paciente_id": 1,
    "data_sessao": "2023-06-15",
    "hora_inicio": "14:00",
    "hora_fim": "15:00",
    "tipo_sessao": "Terapia Individual",
    "resumo": "Primeira sessão de avaliação. Paciente relatou sintomas de ansiedade."
}
```

### 3. Obter Sessão por ID

**Endpoint:** `GET /api/sessoes/:id`

**Descrição:** Obtém os dados de uma sessão específica pelo ID.

**Parâmetros de URL:**
- `id`: ID da sessão

**Exemplo de Requisição:**
```
GET /api/sessoes/1
```

### 4. Listar Sessões de um Paciente

**Endpoint:** `GET /api/sessoes/paciente/:pacienteId`

**Descrição:** Lista todas as sessões de um paciente específico.

**Parâmetros de URL:**
- `pacienteId`: ID do paciente

**Exemplo de Requisição:**
```
GET /api/sessoes/paciente/1
```

### 5. Atualizar Sessão

**Endpoint:** `PUT /api/sessoes/:id`

**Descrição:** Atualiza os dados de uma sessão existente.

**Parâmetros de URL:**
- `id`: ID da sessão

**Corpo da Requisição:**
```json
{
    "hora_fim": "15:30",
    "resumo": "Primeira sessão de avaliação. Paciente relatou sintomas de ansiedade e dificuldade para dormir. Foram discutidas técnicas de relaxamento."
}
```

### 6. Registrar Evolução

**Endpoint:** `POST /api/sessoes/:id/evolucao`

**Descrição:** Registra a evolução de uma sessão específica.

**Parâmetros de URL:**
- `id`: ID da sessão

**Corpo da Requisição:**
```json
{
    "evolucao": "Paciente demonstrou boa adesão às técnicas de respiração propostas. Relatou melhora no padrão de sono após implementar a rotina de relaxamento noturno. Mantém queixas de ansiedade em situações sociais. Para a próxima sessão, será trabalhada a reestruturação cognitiva focada em crenças disfuncionais sobre avaliação social."
}
```

### 7. Excluir Sessão

**Endpoint:** `DELETE /api/sessoes/:id`

**Descrição:** Exclui uma sessão específica.

**Parâmetros de URL:**
- `id`: ID da sessão

**Exemplo de Requisição:**
```
DELETE /api/sessoes/1
```

## Respostas

Todas as respostas seguem o formato padrão:

- **Sucesso**: Código HTTP 200 (OK) ou 201 (Created) com os dados solicitados
- **Erro de validação**: Código HTTP 400 (Bad Request) com mensagem de erro
- **Erro de autenticação**: Código HTTP 401 (Unauthorized) com mensagem de erro
- **Recurso não encontrado**: Código HTTP 404 (Not Found) com mensagem de erro
- **Erro interno**: Código HTTP 500 (Internal Server Error) com mensagem de erro