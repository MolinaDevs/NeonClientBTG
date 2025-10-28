# 🧪 Testes Funcionais - BTG Tickets API

**Autor:** Murilo Molina  
**Data:** Outubro 2025

Este guia contém os **testes funcionais completos** para validar a integração com a API BTG Tickets V2.

---

## 📋 Pré-condições

✅ Servidor com IP liberado para acesso à API BTG  
✅ .NET 8 SDK instalado  
✅ Variáveis de ambiente configuradas (`BTG_CLIENT_ID` e `BTG_CLIENT_SECRET`)  
✅ API rodando na porta 5000

---

## 🚀 Iniciar a API

### Windows:
```cmd
cd C:\BTGTicketsAPI
dotnet run
```

### Linux:
```bash
cd /caminho/para/BTGTicketsAPI
dotnet run
```

**Aguarde até ver:**
```
Now listening on: http://[::]:5000
Application started.
```

---

## 🧪 TESTE 1: Autenticação OAuth2

### Objetivo
Obter token de acesso válido para usar nos demais endpoints.

### Método
**POST** `/BTGTickets/autenticacao`

### Como testar

#### Opção A: Swagger UI (Recomendado)
1. Abra: `http://localhost:5000/swagger`
2. Localize: **POST /BTGTickets/autenticacao**
3. Clique em "Try it out"
4. Clique em "Execute"

#### Opção B: PowerShell
```powershell
$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/BTGTickets/autenticacao" `
    -Method POST `
    -ContentType "application/json" `
    -Body "{}"

$token = $response.access_token
Write-Host "Token obtido: $token"
```

#### Opção C: cURL
```bash
curl -X POST http://localhost:5000/BTGTickets/autenticacao \
  -H "Content-Type: application/json" \
  -d "{}"
```

### Resultado Esperado
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "read write"
}
```

### ✅ Critério de Sucesso
- Status HTTP: **200 OK**
- Retorna `access_token` válido
- Token válido por 1 hora (3600 segundos)

### ❌ Possíveis Erros
| Erro | Causa | Solução |
|------|-------|---------|
| 403 Forbidden | IP não liberado pela BTG | Verificar com BTG se IP está whitelisted |
| 401 Unauthorized | Credenciais inválidas | Verificar `BTG_CLIENT_ID` e `BTG_CLIENT_SECRET` |
| 500 Internal Server Error | Erro de configuração | Verificar logs da aplicação |

---

## 🧪 TESTE 2: Buscar Atributos dos Tickets

### Objetivo
Obter lista de canais, tipos e códigos de terminação disponíveis.

### Método
**GET** `/BTGTickets/tickets/attributes`

### Pré-requisito
✅ Token de autenticação válido (obtido no Teste 1)

### Como testar

#### Via PowerShell:
```powershell
# Use o token obtido no Teste 1
$token = "COLE_SEU_TOKEN_AQUI"

$headers = @{
    "Authorization" = "Bearer $token"
}

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/BTGTickets/tickets/attributes" `
    -Method GET `
    -Headers $headers

$response | ConvertTo-Json
```

#### Via cURL:
```bash
curl -X GET http://localhost:5000/BTGTickets/tickets/attributes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Resultado Esperado
```json
{
  "channels": [
    "PHONE",
    "EMAIL",
    "WHATSAPP"
  ],
  "types": [
    "INBOUND",
    "OUTBOUND"
  ],
  "terminationCodes": [
    "AE",
    "GA",
    "TT",
    "GB",
    "TW"
  ],
  "products": [
    "CARTAO",
    "CCB",
    "LMAIS"
  ]
}
```

### ✅ Critério de Sucesso
- Status HTTP: **200 OK**
- Retorna listas de canais, tipos e códigos
- Estrutura JSON válida

---

## 🧪 TESTE 3: Criar Ticket de Atendimento

### Objetivo
Criar um novo ticket de atendimento para um cliente.

### Método
**POST** `/BTGTickets/tickets/create`

### Dados de Teste
```json
{
  "AccessToken": "SEU_TOKEN_AQUI",
  "Document": "12345678901",
  "phoneAreaCode": "11",
  "phoneNumber": "987654321",
  "channel": "PHONE",
  "type": "OUTBOUND"
}
```

### Como testar

#### Via PowerShell:
```powershell
$token = "COLE_SEU_TOKEN_AQUI"

$body = @{
    AccessToken = $token
    Document = "12345678901"
    phoneAreaCode = "11"
    phoneNumber = "987654321"
    channel = "PHONE"
    type = "OUTBOUND"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/BTGTickets/tickets/create" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$ticketId = $response.ticketId
Write-Host "Ticket criado: $ticketId"
$response | ConvertTo-Json
```

### Resultado Esperado
```json
{
  "ticketId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "CREATED",
  "createdAt": "2025-10-27T20:30:00Z",
  "channel": "PHONE",
  "type": "OUTBOUND"
}
```

### ✅ Critério de Sucesso
- Status HTTP: **200 OK** ou **201 Created**
- Retorna `ticketId` único
- Ticket criado no sistema BTG

⚠️ **IMPORTANTE:** Guarde o `ticketId` para os próximos testes!

---

## 🧪 TESTE 4: Adicionar Contrato ao Ticket

### Objetivo
Vincular um contrato específico ao ticket criado.

### Método
**POST** `/BTGTickets/tickets/contract/add`

### Pré-requisito
✅ `ticketId` válido (obtido no Teste 3)

### Dados de Teste
```json
{
  "AccessToken": "SEU_TOKEN_AQUI",
  "Document": "12345678901",
  "TicketId": "TICKET_ID_DO_TESTE_3",
  "terminationCode": "GA",
  "contractNumber": "CN-81273197",
  "product": "CARTAO",
  "dueDays": 30
}
```

### Como testar

#### Via PowerShell:
```powershell
$token = "COLE_SEU_TOKEN_AQUI"
$ticketId = "COLE_O_TICKET_ID_AQUI"

$body = @{
    AccessToken = $token
    Document = "12345678901"
    TicketId = $ticketId
    terminationCode = "GA"
    contractNumber = "CN-81273197"
    product = "CARTAO"
    dueDays = 30
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/BTGTickets/tickets/contract/add" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$response | ConvertTo-Json
```

### Resultado Esperado
```json
{
  "success": true,
  "message": "Contract added successfully",
  "contractId": "contract-uuid-here"
}
```

### ✅ Critério de Sucesso
- Status HTTP: **200 OK**
- Contrato vinculado ao ticket
- Confirmação de sucesso

---

## 🧪 TESTE 5: Encerrar Ticket

### Objetivo
Finalizar o atendimento e encerrar o ticket.

### Método
**PUT** `/BTGTickets/tickets/close`

### Dados de Teste
```json
{
  "AccessToken": "SEU_TOKEN_AQUI",
  "Document": "12345678901",
  "TicketId": "TICKET_ID_DO_TESTE_3",
  "additionalInfo": "Cliente realizou o pagamento conforme acordado",
  "email": "cliente@email.com",
  "scheduledDate": "2025-11-15"
}
```

### Como testar

#### Via PowerShell:
```powershell
$token = "COLE_SEU_TOKEN_AQUI"
$ticketId = "COLE_O_TICKET_ID_AQUI"

$body = @{
    AccessToken = $token
    Document = "12345678901"
    TicketId = $ticketId
    additionalInfo = "Cliente realizou o pagamento conforme acordado"
    email = "cliente@email.com"
    scheduledDate = "2025-11-15"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/BTGTickets/tickets/close" `
    -Method PUT `
    -ContentType "application/json" `
    -Body $body

$response | ConvertTo-Json
```

### Resultado Esperado
```json
{
  "success": true,
  "status": "CLOSED",
  "closedAt": "2025-10-27T21:00:00Z"
}
```

### ✅ Critério de Sucesso
- Status HTTP: **200 OK**
- Ticket fechado com sucesso
- Status atualizado para CLOSED

---

## 🧪 TESTE 6: Criar Tentativa de Discador (Attempt Ticket)

### Objetivo
Registrar uma tentativa de contato via discador automático.

### Método
**POST** `/BTGTickets/tickets/attempt/create`

### Dados de Teste
```json
{
  "AccessToken": "SEU_TOKEN_AQUI",
  "Document": "12345678901",
  "phoneAreaCode": "11",
  "phoneNumber": "987654321",
  "channel": "PHONE",
  "type": "OUTBOUND",
  "attemptDate": "2025-10-27"
}
```

### Como testar

#### Via PowerShell:
```powershell
$token = "COLE_SEU_TOKEN_AQUI"

$body = @{
    AccessToken = $token
    Document = "12345678901"
    phoneAreaCode = "11"
    phoneNumber = "987654321"
    channel = "PHONE"
    type = "OUTBOUND"
    attemptDate = (Get-Date -Format "yyyy-MM-dd")
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/BTGTickets/tickets/attempt/create" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$response | ConvertTo-Json
```

### Resultado Esperado
```json
{
  "attemptTicketId": "attempt-uuid-here",
  "status": "CREATED"
}
```

### ✅ Critério de Sucesso
- Status HTTP: **200 OK** ou **201 Created**
- Tentativa registrada com sucesso

---

## 🧪 TESTE 7: Criar Tentativas em Lote (Batch)

### Objetivo
Criar múltiplas tentativas de discador em uma única requisição.

### Método
**POST** `/BTGTickets/tickets/attempt/batch`

### Dados de Teste
```json
{
  "AccessToken": "SEU_TOKEN_AQUI",
  "attempts": [
    {
      "Document": "11111111111",
      "phoneAreaCode": "11",
      "phoneNumber": "911111111",
      "channel": "PHONE",
      "type": "OUTBOUND"
    },
    {
      "Document": "22222222222",
      "phoneAreaCode": "21",
      "phoneNumber": "922222222",
      "channel": "PHONE",
      "type": "OUTBOUND"
    }
  ]
}
```

### Como testar

#### Via PowerShell:
```powershell
$token = "COLE_SEU_TOKEN_AQUI"

$body = @{
    AccessToken = $token
    attempts = @(
        @{
            Document = "11111111111"
            phoneAreaCode = "11"
            phoneNumber = "911111111"
            channel = "PHONE"
            type = "OUTBOUND"
        },
        @{
            Document = "22222222222"
            phoneAreaCode = "21"
            phoneNumber = "922222222"
            channel = "PHONE"
            type = "OUTBOUND"
        }
    )
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/BTGTickets/tickets/attempt/batch" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$response | ConvertTo-Json
```

### Resultado Esperado
```json
{
  "success": true,
  "totalCreated": 2,
  "attempts": [
    {
      "attemptTicketId": "attempt-uuid-1",
      "status": "CREATED"
    },
    {
      "attemptTicketId": "attempt-uuid-2",
      "status": "CREATED"
    }
  ]
}
```

### ✅ Critério de Sucesso
- Status HTTP: **200 OK**
- Todas as tentativas criadas com sucesso
- Retorna IDs de cada tentativa

---

## 📊 Checklist de Validação Completa

Execute todos os testes na sequência:

- [ ] **Teste 1:** Autenticação - Token obtido com sucesso ✅
- [ ] **Teste 2:** Buscar Atributos - Listas retornadas corretamente ✅
- [ ] **Teste 3:** Criar Ticket - Ticket criado e ID retornado ✅
- [ ] **Teste 4:** Adicionar Contrato - Contrato vinculado ✅
- [ ] **Teste 5:** Encerrar Ticket - Ticket fechado com sucesso ✅
- [ ] **Teste 6:** Criar Attempt Ticket - Tentativa registrada ✅
- [ ] **Teste 7:** Batch Attempts - Múltiplas tentativas criadas ✅

---

## 🔄 Fluxo Completo de Teste

```
1. Autenticação → Obter Token
2. Buscar Atributos → Validar opções disponíveis
3. Criar Ticket → Obter Ticket ID
4. Adicionar Contrato → Vincular contrato ao ticket
5. Encerrar Ticket → Finalizar atendimento
```

---

## 📝 Registro de Testes

| Data | Teste | Status | Observações |
|------|-------|--------|-------------|
| __/__/____ | Teste 1 - Autenticação | ⬜ | |
| __/__/____ | Teste 2 - Atributos | ⬜ | |
| __/__/____ | Teste 3 - Criar Ticket | ⬜ | |
| __/__/____ | Teste 4 - Adicionar Contrato | ⬜ | |
| __/__/____ | Teste 5 - Encerrar Ticket | ⬜ | |
| __/__/____ | Teste 6 - Attempt Ticket | ⬜ | |
| __/__/____ | Teste 7 - Batch Attempts | ⬜ | |

---

## 🆘 Troubleshooting

### Token Expirado
**Sintoma:** Erro 401 Unauthorized após 1 hora  
**Solução:** Execute novamente o Teste 1 para obter novo token

### Erro de Timeout
**Sintoma:** Request demora muito e retorna timeout  
**Solução:** Verifique conexão com API BTG, pode estar instável

### Dados Inválidos
**Sintoma:** Erro 400 Bad Request  
**Solução:** Verifique se todos os campos obrigatórios estão preenchidos corretamente

---

**Autor:** Murilo Molina (murilo.molina@gmail.com)  
**Última atualização:** Outubro 2025
