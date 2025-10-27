# BTG Tickets WS - API Intermediária

API intermediária em C# ASP.NET Web API para integração com BTG Tickets V2, seguindo a mesma arquitetura do projeto Neon.

## Estrutura do Projeto

```
BTGTicketsWS/
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
├── App_Start/
│   └── WebApiConfig.cs             # Configuração da Web API
├── Properties/
│   └── AssemblyInfo.cs             # Informações do assembly
├── Web.config                       # Configurações do aplicativo
├── Global.asax                      # Ponto de entrada da aplicação
├── Global.asax.cs
├── packages.config                  # Pacotes NuGet
└── BTGTicketsWS.csproj             # Arquivo do projeto
```

## Endpoints Disponíveis

### Autenticação
- **POST** `/btg/autenticacao` - Gera token de acesso OAuth2 (duração: 1h)

### Tickets
- **POST** `/btg/tickets/attributes` - Busca atributos dos tickets (canais, tipos, códigos de terminação)
- **POST** `/btg/tickets/create` - Cria um novo ticket de atendimento
- **POST** `/btg/tickets/contract/add` - Adiciona contrato ao ticket
- **POST** `/btg/tickets/close` - Encerra ticket de atendimento

### Attempt Tickets (Tentativa Discador)
- **POST** `/btg/tickets/attempt/create` - Cria tentativa de discador
- **POST** `/btg/tickets/attempt/batch` - Cria tentativas em lote

## Configuração

### 1. Credenciais BTG
Edite o arquivo `Web.config` e configure suas credenciais:

```xml
<appSettings>
  <add key="BTG_APP_ID" value="SEU_APP_ID" />
  <add key="BTG_SECRET" value="SEU_SECRET" />
</appSettings>
```

Ou edite diretamente no `BTGTicketsController.cs` no método `AutenticacaoAsync()`:

```csharp
string credentials = "SEU_APP_ID:SEU_SECRET";
```

### 2. Ambiente
Por padrão, o projeto está configurado para o ambiente de **Homologação (UAT)**:
- URL: `https://api-everest-uat.btgpactual.com`

Para usar **Produção**, altere no `BTGTicketsController.cs`:

```csharp
public string _UrlBase = "https://api-everest-prd.btgpactual.com";
```

### 3. Proxy (Opcional)
Se necessário usar proxy, configure no `BTGTicketsController.cs`:

```csharp
_handler = new HttpClientHandler
{
    Proxy = proxy,
    UseProxy = true // Mude para true e configure o proxy
};
```

## Exemplos de Uso

### 1. Autenticação
```http
POST /btg/autenticacao
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

### 2. Criar Ticket
```http
POST /btg/tickets/create
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

### 3. Adicionar Contrato
```http
POST /btg/tickets/contract/add
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

### 4. Encerrar Ticket
```http
POST /btg/tickets/close
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
- Tratamento de erros consistente
- Serialização JSON com Newtonsoft.Json

## Tecnologias

- ASP.NET Web API (.NET Framework 4.7.2)
- C# 7.3
- Newtonsoft.Json 13.0.3
- Microsoft.AspNet.WebApi 5.2.9
- HttpClient para requests HTTP

## Observações Importantes

1. **Segurança**: Nunca commitar credenciais no código. Use variáveis de ambiente ou configurações seguras.
2. **Token**: O Bearer Token expira em 1 hora. Implemente cache ou renovação automática se necessário.
3. **Operador**: O header `createdBy` deve ser preenchido com o nome real do operador.
4. **Ambiente**: Sempre teste em UAT antes de usar em produção.

## Próximos Passos

- [ ] Implementar cache de token
- [ ] Adicionar retry logic para falhas de rede
- [ ] Criar logging detalhado
- [ ] Implementar testes unitários
- [ ] Adicionar validações de negócio
- [ ] Documentar com Swagger/OpenAPI
