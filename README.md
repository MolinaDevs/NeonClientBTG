# BTG Tickets API - API Intermediária

API intermediária em C# ASP.NET Core Web API (.NET 8) para integração com BTG Tickets V2, seguindo a mesma arquitetura do projeto Neon.

## Estrutura do Projeto

```
BTGTicketsAPI/
├── Controllers/
│   └── BTGTicketsController.cs    # Controller principal com todos os endpoints
├── Models/
│   └── BTG/
│       ├── Token.cs                          # Model para token OAuth2
│       ├── CreateTicketRequest.cs            # Request para criar ticket
│       ├── ContractRequest.cs                # Request para adicionar contrato
│       ├── CloseTicketRequest.cs             # Request para encerrar ticket
│       ├── TicketAttributesResponse.cs       # Response de atributos
│       ├── CreateAttemptTicketRequest.cs     # Request para tentativa discador
│       └── BasicRequest.cs                   # Request básico
├── appsettings.json                # Configurações (ambiente, credenciais, URLs)
├── Program.cs                      # Ponto de entrada da aplicação
└── BTGTicketsAPI.csproj           # Arquivo do projeto
```

## Endpoints Disponíveis

### Autenticação
- **POST** `/BTGTickets/autenticacao` - Gera token de acesso OAuth2 (duração: 1h)

### Tickets
- **GET** `/BTGTickets/tickets/attributes` - Busca atributos dos tickets (canais, tipos, códigos de terminação)
- **POST** `/BTGTickets/tickets/create` - Cria um novo ticket de atendimento
- **POST** `/BTGTickets/tickets/contract/add` - Adiciona contrato ao ticket
- **PUT** `/BTGTickets/tickets/close` - Encerra ticket de atendimento

### Attempt Tickets (Tentativa Discador)
- **POST** `/BTGTickets/tickets/attempt/create` - Cria tentativa de discador
- **POST** `/BTGTickets/tickets/attempt/batch` - Cria tentativas em lote

## Configuração

### 1. Credenciais BTG

Edite o arquivo `appsettings.json` e configure suas credenciais:

```json
{
  "BTG": {
    "Environment": "UAT",
    "AppId": "SEU_APP_ID",
    "Secret": "SEU_SECRET",
    "CreatedBy": "OPERADOR_SISTEMA",
    "AuthUrl": "https://btg-agreement.auth.sa-east-1.amazoncognito.com",
    "ApiUrlUAT": "https://api-everest-uat.btgpactual.com",
    "ApiUrlPRD": "https://api-everest-prd.btgpactual.com"
  }
}
```

### 2. Selecionar Ambiente (UAT ou PRD)

**IMPORTANTE**: Você NÃO precisa alterar código para trocar entre ambientes!

Para usar **Homologação (UAT)** - recomendado para testes:
```json
"Environment": "UAT"
```

Para usar **Produção (PRD)**:
```json
"Environment": "PRD"
```

A API automaticamente seleciona a URL correta baseada nesta configuração.

### 3. Configurar Operador

O campo `CreatedBy` será enviado automaticamente como header em todos os endpoints que criam/modificam tickets:

```json
"CreatedBy": "NOME_DO_OPERADOR"
```

### 4. Executar a Aplicação

```bash
dotnet run
```

A API estará disponível em: `http://localhost:5000`

## Exemplos de Uso

### 1. Autenticação
```http
POST /BTGTickets/autenticacao
Content-Type: application/json

{}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}
```

### 2. Buscar Atributos
```http
GET /BTGTickets/tickets/attributes
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "channels": ["PHONE", "EMAIL"],
  "types": ["INBOUND", "OUTBOUND"],
  "terminationCodes": ["AE", "GA", "TT", "GB"]
}
```

### 3. Criar Ticket
```http
POST /BTGTickets/tickets/create
Content-Type: application/json

{
  "AccessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Document": "12345678901",
  "phoneAreaCode": "11",
  "phoneNumber": "987654321",
  "channel": "PHONE",
  "type": "OUTBOUND"
}
```

### 4. Adicionar Contrato
```http
POST /BTGTickets/tickets/contract/add
Content-Type: application/json

{
  "AccessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Document": "12345678901",
  "TicketId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "terminationCode": "GA",
  "contractNumber": "CN-81273197",
  "product": "CARTAO",
  "dueDays": 25
}
```

### 5. Encerrar Ticket
```http
PUT /BTGTickets/tickets/close
Content-Type: application/json

{
  "AccessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Document": "12345678901",
  "TicketId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "additionalInfo": "Cliente realizou pagamento",
  "email": "cliente@email.com",
  "scheduledDate": "2025-01-15"
}
```

## Documentação BTG

A documentação completa da API BTG Tickets V2 está disponível em `attached_assets/_ (1) (1)_1761602364051.pdf`.

### Principais Conceitos

- **Bearer Token**: Expira a cada 1 hora
- **Canais**: PHONE, EMAIL, etc.
- **Tipos**: INBOUND, OUTBOUND
- **Códigos de Terminação**: AE, GA, TT, GB, TW, etc.
- **Produtos**: CARTAO, CCB, LMAIS

## Arquitetura

Este projeto segue a mesma arquitetura do NeonController:
- Controllers para gerenciar rotas e lógica de negócio
- Models para estruturar requests/responses
- HttpClient para chamadas HTTP assíncronas
- Configuração via appsettings.json (não hardcoded)
- Tratamento de erros consistente
- Serialização JSON com System.Text.Json

## Tecnologias

- ASP.NET Core Web API (.NET 8)
- C# 12
- System.Text.Json (built-in)
- HttpClient para requests HTTP
- Configuração via appsettings.json

## Observações Importantes

1. **Segurança**: As credenciais estão em `appsettings.json`. Para produção, use:
   - Variáveis de ambiente
   - Azure Key Vault
   - User Secrets (desenvolvimento local)
   - NUNCA commite credenciais reais no repositório

2. **Token**: O Bearer Token expira em 1 hora. Implemente cache ou renovação automática se necessário.

3. **Header createdBy**: É configurável via `appsettings.json` e enviado automaticamente pela API em todos os endpoints que modificam dados.

4. **Ambiente**: 
   - SEMPRE teste em UAT antes de usar em produção
   - Troque entre ambientes apenas alterando `"Environment": "UAT"` ou `"Environment": "PRD"` no appsettings.json
   - NÃO é necessário alterar código para mudar de ambiente

5. **Endpoints BTG**: 
   - Criar Ticket: POST `/v2/btg-tickets/customers/{document}/tickets`
   - Attempt Ticket: POST `/v2/btg-tickets/customers/{document}/attempt-tickets`
   - Adicionar Contrato: POST `/v2/btg-tickets/customers/{document}/attempt-tickets/{ticketId}/contracts`
   - Encerrar Ticket: PUT `/v2/btg-tickets/customers/{document}/attempt-tickets/{ticketId}/close`
   - Buscar Atributos: GET `/v2/btg-tickets/attempt-tickets/attributes`

## Próximos Passos

- [ ] Implementar cache de token OAuth2
- [ ] Adicionar retry logic para falhas de rede
- [ ] Criar logging detalhado com Serilog
- [ ] Implementar testes unitários e de integração
- [ ] Adicionar validações de negócio
- [ ] Documentar com Swagger/OpenAPI
- [ ] Migrar credenciais para User Secrets ou Azure Key Vault
- [ ] Implementar health checks
- [ ] Adicionar telemetria e métricas

## Migração de .NET Framework para .NET 8

Esta API foi migrada de .NET Framework 4.7.2 para .NET 8 para aproveitar:
- Cross-platform (Linux, macOS, Windows)
- Performance superior
- Suporte a recursos modernos do C#
- Melhor integração com containers
- Long-term support (LTS)

As principais diferenças da migração:
- `Web.config` → `appsettings.json`
- `Global.asax` → `Program.cs`
- `Newtonsoft.Json` → `System.Text.Json`
- ASP.NET Web API → ASP.NET Core Web API
