# BTG Tickets API - API Intermediária

**Desenvolvedor:** Murilo Molina  
**E-mail:** murilo.molina@gmail.com  
**Versão:** 1.0  
**Data:** Outubro 2025

---

API intermediária desenvolvida em C# ASP.NET Core Web API (.NET 8) para integração com **BTG Tickets V2**, seguindo a mesma arquitetura do projeto Neon.

## 📋 Descrição

Esta API fornece uma camada intermediária para comunicação com a API BTG Tickets V2, permitindo:
- Autenticação OAuth2 com refresh automático
- Criação e gestão de tickets de atendimento
- Registro de tentativas de discador (attempt tickets)
- Vinculação de contratos aos tickets
- Encerramento de tickets
- Consulta de atributos (canais, tipos, códigos)

## 🏗️ Estrutura do Projeto

```
BTGTicketsAPI/
├── Controllers/
│   └── BTGTicketsController.cs         # Controller principal com 7 endpoints
├── Models/
│   └── BTG/
│       ├── Token.cs                    # Model para token OAuth2
│       ├── CreateTicketRequest.cs      # Request para criar ticket
│       ├── ContractRequest.cs          # Request para adicionar contrato
│       ├── CloseTicketRequest.cs       # Request para encerrar ticket
│       ├── TicketAttributesResponse.cs # Response de atributos
│       ├── CreateAttemptTicketRequest.cs # Request para tentativa discador
│       └── BasicRequest.cs             # Request básico
├── appsettings.json                    # Configurações da aplicação
├── Program.cs                          # Ponto de entrada
└── BTGTicketsAPI.csproj               # Arquivo do projeto
```

## 🚀 Tecnologias Utilizadas

- **.NET 8** - Framework principal
- **ASP.NET Core Web API** - Para criação de APIs RESTful
- **System.Text.Json** - Serialização JSON
- **HttpClient** - Chamadas HTTP assíncronas
- **Swagger/OpenAPI** - Documentação interativa

## 📡 Endpoints Disponíveis

### Autenticação
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/BTGTickets/autenticacao` | Gera token de acesso OAuth2 (válido por 1h) |

### Gestão de Tickets
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/BTGTickets/tickets/attributes` | Busca atributos disponíveis |
| POST | `/BTGTickets/tickets/create` | Cria novo ticket de atendimento |
| POST | `/BTGTickets/tickets/contract/add` | Adiciona contrato ao ticket |
| PUT | `/BTGTickets/tickets/close` | Encerra ticket |

### Attempt Tickets (Discador)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/BTGTickets/tickets/attempt/create` | Cria tentativa de discador |
| POST | `/BTGTickets/tickets/attempt/batch` | Cria múltiplas tentativas |

## ⚙️ Configuração

### Pré-requisitos
- .NET 8 SDK ou superior
- Windows Server 2019+ ou Linux
- IP liberado para acesso à API BTG
- Credenciais BTG (Client ID e Client Secret)

### Instalação

1. **Clone ou baixe o projeto:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd BTGTicketsAPI
   ```

2. **Configure as credenciais:**

   **Opção A - Variáveis de Ambiente (Recomendado):**
   
   Windows (PowerShell):
   ```powershell
   [System.Environment]::SetEnvironmentVariable('BTG_CLIENT_ID', 'seu_client_id', 'Machine')
   [System.Environment]::SetEnvironmentVariable('BTG_CLIENT_SECRET', 'seu_client_secret', 'Machine')
   ```

   Linux:
   ```bash
   export BTG_CLIENT_ID="seu_client_id"
   export BTG_CLIENT_SECRET="seu_client_secret"
   ```

   **Opção B - Arquivo de Configuração:**
   
   Edite `appsettings.json`:
   ```json
   {
     "BTG": {
       "Environment": "UAT",
       "CreatedBy": "SEU_NOME_OPERADOR"
     }
   }
   ```

3. **Restaure as dependências:**
   ```bash
   dotnet restore
   ```

4. **Compile o projeto:**
   ```bash
   dotnet build --configuration Release
   ```

5. **Execute a aplicação:**
   ```bash
   dotnet run
   ```

A API estará disponível em: `http://localhost:5000`

## 🧪 Testes

### Swagger UI (Interface Web)

Acesse: `http://localhost:5000/swagger`

Interface interativa para testar todos os endpoints.

### Teste Manual via PowerShell

```powershell
# 1. Autenticar
$response = Invoke-RestMethod -Uri "http://localhost:5000/BTGTickets/autenticacao" -Method POST -ContentType "application/json" -Body "{}"
$token = $response.access_token

# 2. Buscar Atributos
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:5000/BTGTickets/tickets/attributes" -Method GET -Headers $headers

# 3. Criar Ticket
$body = @{
    AccessToken = $token
    Document = "12345678901"
    phoneAreaCode = "11"
    phoneNumber = "987654321"
    channel = "PHONE"
    type = "OUTBOUND"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/BTGTickets/tickets/create" -Method POST -ContentType "application/json" -Body $body
```

Para testes funcionais completos, consulte: **[TESTES_FUNCIONAIS.md](TESTES_FUNCIONAIS.md)**

## 🏭 Deploy em Produção

### Deploy no IIS (Windows)

1. Publique a aplicação:
   ```cmd
   dotnet publish --configuration Release --output C:\inetpub\BTGTicketsAPI
   ```

2. Configure o site no IIS apontando para a pasta publicada

3. Configure as variáveis de ambiente no Application Pool

### Deploy como Serviço Windows

```cmd
sc create BTGTicketsAPI binPath= "C:\caminho\para\BTGTicketsAPI.exe"
sc config BTGTicketsAPI start= auto
sc start BTGTicketsAPI
```

### Deploy no Linux (systemd)

```bash
sudo dotnet publish --configuration Release --output /var/www/btgtickets
sudo systemctl enable btgtickets
sudo systemctl start btgtickets
```

Para instruções detalhadas, consulte: **[INSTALACAO_SERVIDOR.md](INSTALACAO_SERVIDOR.md)**

## 🔒 Segurança

### Boas Práticas Implementadas

- ✅ Credenciais via variáveis de ambiente (nunca hardcoded)
- ✅ Suporte a HTTPS/TLS
- ✅ Headers de autenticação OAuth2
- ✅ Validação de dados de entrada
- ✅ Tratamento de erros estruturado
- ✅ Logs de auditoria

### Configuração HTTPS

Edite `appsettings.json`:
```json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://0.0.0.0:5001",
        "Certificate": {
          "Path": "certificado.pfx",
          "Password": "senha"
        }
      }
    }
  }
}
```

## 📊 Ambientes

### UAT (Homologação)

```json
{
  "BTG": {
    "Environment": "UAT"
  }
}
```

URLs:
- Auth: `https://agreements-api-uat.btgpactual.com/v2/authorization`
- API: `https://agreements-api-uat.btgpactual.com`

### PRD (Produção)

```json
{
  "BTG": {
    "Environment": "PRD"
  }
}
```

URLs:
- Auth: `https://agreements-api-prd.btgpactual.com/v2/authorization`
- API: `https://agreements-api-prd.btgpactual.com`

⚠️ **IMPORTANTE:** Sempre teste em UAT antes de usar em produção!

## 🔧 Troubleshooting

### Erro 403 Forbidden
- Verifique se o IP está liberado pela BTG
- Confirme as credenciais

### Erro 401 Unauthorized
- Token expirado (dura 1 hora)
- Credenciais inválidas

### Porta em uso
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Ver logs em tempo real
```bash
# Linux
tail -f /var/log/btgtickets/log.txt

# Windows PowerShell
Get-Content C:\BTGTicketsAPI\logs\log.txt -Wait
```

## 📚 Documentação Adicional

- **[INSTALACAO_SERVIDOR.md](INSTALACAO_SERVIDOR.md)** - Guia completo de instalação e deploy
- **[TESTES_FUNCIONAIS.md](TESTES_FUNCIONAIS.md)** - Roteiro de testes funcionais
- **[appsettings.EXAMPLE.json](appsettings.EXAMPLE.json)** - Exemplo de configuração

## 🗺️ Roadmap

### Versão 1.0 (Atual)
- ✅ Implementação de todos os endpoints BTG Tickets V2
- ✅ Autenticação OAuth2
- ✅ Documentação Swagger
- ✅ Suporte a múltiplos ambientes

### Próximas Versões
- [ ] Cache de token com renovação automática
- [ ] Retry logic para falhas de rede
- [ ] Logging estruturado com Serilog
- [ ] Testes unitários e de integração
- [ ] Health checks
- [ ] Métricas e telemetria
- [ ] Rate limiting

## 📄 Licença

Projeto proprietário desenvolvido para integração com BTG Pactual.

## 👨‍💻 Autor

**Murilo Molina**  
E-mail: murilo.molina@gmail.com

## 📞 Suporte

Para questões relacionadas à API BTG Tickets V2, entre em contato com o suporte técnico do BTG Pactual através dos canais oficiais.

---

**Última atualização:** Outubro 2025
