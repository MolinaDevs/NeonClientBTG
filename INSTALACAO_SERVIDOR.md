# 📦 Guia de Instalação e Deploy - BTG Tickets API

**Autor:** Murilo Molina (murilo.molina@gmail.com)  
**Versão:** 1.0  
**Data:** Outubro 2025

---

## 📋 Pré-requisitos

### Software Necessário

1. **.NET 8 SDK** (ou superior)
   - Download: https://dotnet.microsoft.com/download/dotnet/8.0
   - Versão mínima: 8.0

2. **Windows Server** (2019 ou superior) ou **Linux**
   - Com acesso à internet
   - IP liberado para acesso à API BTG

3. **IIS** (opcional, para produção em Windows)
   - Ou qualquer servidor web compatível com ASP.NET Core

4. **Git** (opcional, para clone do repositório)
   - Download: https://git-scm.com/downloads

---

## 🚀 Instalação Passo a Passo

### **Passo 1: Instalar o .NET 8 SDK**

#### Windows:
1. Acesse: https://dotnet.microsoft.com/download/dotnet/8.0
2. Baixe o **SDK x64** (não o Runtime)
3. Execute o instalador
4. Após a instalação, abra o **Prompt de Comando** e execute:
   ```cmd
   dotnet --version
   ```
   Deve retornar algo como: `8.0.x`

#### Linux (Ubuntu/Debian):
```bash
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
sudo ./dotnet-install.sh --channel 8.0
```

Adicione ao PATH (adicione no `~/.bashrc`):
```bash
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$DOTNET_ROOT:$DOTNET_ROOT/tools
```

Verifique:
```bash
dotnet --version
```

---

### **Passo 2: Obter os Arquivos do Projeto**

#### Opção A: Via Git (recomendado)
```bash
git clone <URL_DO_REPOSITORIO>
cd BTGTicketsAPI
```

#### Opção B: Download Manual
1. Faça download do arquivo ZIP do projeto
2. Extraia para uma pasta (ex: `C:\BTGTicketsAPI`)
3. Navegue até a pasta:
   ```cmd
   cd C:\BTGTicketsAPI
   ```

---

### **Passo 3: Configurar Credenciais BTG**

Edite o arquivo `appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "BTG": {
    "Environment": "UAT",
    "CreatedBy": "SEU_NOME_OPERADOR",
    "AuthUrl": "https://agreements-api-uat.btgpactual.com/v2/authorization",
    "ApiUrlUAT": "https://agreements-api-uat.btgpactual.com",
    "ApiUrlPRD": "https://agreements-api-prd.btgpactual.com"
  }
}
```

**⚠️ SEGURANÇA:** Não coloque as credenciais diretamente no `appsettings.json` em produção!

---

### **Passo 4: Configurar Variáveis de Ambiente (Seguro)**

#### Windows (Recomendado para Produção):

1. **Via Prompt de Comando (Sessão Atual):**
```cmd
set BTG_CLIENT_ID=4fvga0jg4u8ui9f5p6e1ijs5mp
set BTG_CLIENT_SECRET=121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5
```

2. **Via Variáveis de Sistema (Permanente):**
   - Abra: `Painel de Controle > Sistema > Configurações Avançadas > Variáveis de Ambiente`
   - Em "Variáveis do Sistema", clique em "Novo"
   - Nome: `BTG_CLIENT_ID`
   - Valor: `4fvga0jg4u8ui9f5p6e1ijs5mp`
   - Repita para `BTG_CLIENT_SECRET`

3. **Via PowerShell (Permanente):**
```powershell
[System.Environment]::SetEnvironmentVariable('BTG_CLIENT_ID', '4fvga0jg4u8ui9f5p6e1ijs5mp', 'Machine')
[System.Environment]::SetEnvironmentVariable('BTG_CLIENT_SECRET', '121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5', 'Machine')
```

#### Linux:

1. Adicione ao `~/.bashrc` ou `/etc/environment`:
```bash
export BTG_CLIENT_ID="4fvga0jg4u8ui9f5p6e1ijs5mp"
export BTG_CLIENT_SECRET="121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5"
```

2. Recarregue:
```bash
source ~/.bashrc
```

---

### **Passo 5: Compilar o Projeto**

Na pasta do projeto, execute:

```cmd
dotnet restore
dotnet build --configuration Release
```

**Saída esperada:**
```
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

---

### **Passo 6: Executar a API (Modo Desenvolvimento)**

Para testar localmente:

```cmd
dotnet run
```

**Saída esperada:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://[::]:5000
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

A API estará disponível em: **http://localhost:5000**

---

## ✅ Testar a API

### Teste 1: Verificar se o Servidor Está Rodando

Abra o navegador e acesse:
```
http://localhost:5000/swagger
```

Você deve ver a **interface Swagger** com todos os endpoints documentados.

---

### Teste 2: Autenticação BTG

#### Via Swagger (Interface Web):

1. Acesse: `http://localhost:5000/swagger`
2. Localize o endpoint: **POST /BTGTickets/autenticacao**
3. Clique em "Try it out"
4. Clique em "Execute"

**Resposta esperada (Sucesso):**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

#### Via PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/BTGTickets/autenticacao" -Method POST -ContentType "application/json" -Body "{}"
```

#### Via cURL (Linux/Git Bash):

```bash
curl -X POST http://localhost:5000/BTGTickets/autenticacao \
  -H "Content-Type: application/json" \
  -d "{}"
```

---

### Teste 3: Buscar Atributos

Copie o `access_token` do teste anterior e use:

#### Via Swagger:
1. Endpoint: **GET /BTGTickets/tickets/attributes**
2. Cole no campo "Authorization": `Bearer SEU_TOKEN_AQUI`
3. Execute

#### Via PowerShell:
```powershell
$headers = @{
    "Authorization" = "Bearer SEU_TOKEN_AQUI"
}
Invoke-RestMethod -Uri "http://localhost:5000/BTGTickets/tickets/attributes" -Method GET -Headers $headers
```

---

### Teste 4: Criar Ticket

```powershell
$body = @{
    AccessToken = "SEU_TOKEN_AQUI"
    Document = "12345678901"
    phoneAreaCode = "11"
    phoneNumber = "987654321"
    channel = "PHONE"
    type = "OUTBOUND"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/BTGTickets/tickets/create" -Method POST -ContentType "application/json" -Body $body
```

---

## 🏭 Deploy em Produção

### Opção 1: Deploy como Serviço Windows

#### 1. Publicar a aplicação:
```cmd
dotnet publish --configuration Release --output C:\inetpub\BTGTicketsAPI
```

#### 2. Instalar como Serviço Windows:

Instale o `dotnet-windows-service` (se necessário):
```cmd
dotnet add package Microsoft.Extensions.Hosting.WindowsServices
```

Crie o serviço:
```cmd
sc create BTGTicketsAPI binPath= "C:\inetpub\BTGTicketsAPI\BTGTicketsAPI.exe"
sc config BTGTicketsAPI start= auto
sc start BTGTicketsAPI
```

---

### Opção 2: Deploy no IIS

#### 1. Instalar módulo ASP.NET Core no IIS:
- Download: https://dotnet.microsoft.com/permalink/dotnetcore-current-windows-runtime-bundle-installer
- Execute o instalador
- Reinicie o IIS: `iisreset`

#### 2. Publicar a aplicação:
```cmd
dotnet publish --configuration Release --output C:\inetpub\BTGTicketsAPI
```

#### 3. Configurar no IIS:
1. Abra o **Gerenciador do IIS**
2. Clique com botão direito em "Sites" > "Adicionar Site"
3. Nome do site: `BTGTicketsAPI`
4. Caminho físico: `C:\inetpub\BTGTicketsAPI`
5. Porta: `5000` (ou outra de sua preferência)
6. Clique em "OK"

#### 4. Configurar Pool de Aplicativos:
1. Vá em "Pools de Aplicativos"
2. Localize o pool do seu site
3. Configurações avançadas:
   - **.NET CLR version**: `Sem Código Gerenciado`
   - **Identidade**: `ApplicationPoolIdentity` ou conta de serviço

---

### Opção 3: Deploy no Linux (systemd)

#### 1. Publicar:
```bash
dotnet publish --configuration Release --output /var/www/btgtickets
```

#### 2. Criar arquivo de serviço:
```bash
sudo nano /etc/systemd/system/btgtickets.service
```

Conteúdo:
```ini
[Unit]
Description=BTG Tickets API
After=network.target

[Service]
WorkingDirectory=/var/www/btgtickets
ExecStart=/usr/bin/dotnet /var/www/btgtickets/BTGTicketsAPI.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=btgtickets
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=BTG_CLIENT_ID=4fvga0jg4u8ui9f5p6e1ijs5mp
Environment=BTG_CLIENT_SECRET=121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5

[Install]
WantedBy=multi-user.target
```

#### 3. Ativar e iniciar:
```bash
sudo systemctl enable btgtickets
sudo systemctl start btgtickets
sudo systemctl status btgtickets
```

---

## 🔒 Segurança em Produção

### 1. HTTPS (SSL/TLS)

Configure certificado SSL:

#### No `appsettings.json`:
```json
{
  "Kestrel": {
    "Endpoints": {
      "Https": {
        "Url": "https://0.0.0.0:5001",
        "Certificate": {
          "Path": "certificado.pfx",
          "Password": "senha_certificado"
        }
      }
    }
  }
}
```

### 2. Proteção de Credenciais

**Nunca** commite credenciais reais no Git!

Use Azure Key Vault, AWS Secrets Manager, ou variáveis de ambiente.

### 3. Firewall

Libere apenas as portas necessárias:
- Porta 5000 (HTTP) ou 5001 (HTTPS)
- Restrinja acesso apenas aos IPs autorizados

---

## 🔧 Troubleshooting

### Erro: "Could not find 'dotnet'"
**Solução:** Instale o .NET SDK ou adicione ao PATH

### Erro: "Failed to bind to address already in use"
**Solução:** Outra aplicação está usando a porta 5000
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Erro: "403 Forbidden" ao autenticar
**Solução:** 
- Verifique se as credenciais estão corretas
- Confirme que o IP do servidor está liberado pela BTG

### Erro: "Connection refused"
**Solução:** Firewall bloqueando a porta
```cmd
netsh advfirewall firewall add rule name="BTG API" dir=in action=allow protocol=TCP localport=5000
```

---

## 📊 Monitoramento

### Logs da Aplicação

Os logs são salvos em:
- **Windows:** `C:\BTGTicketsAPI\logs\`
- **Linux:** `/var/log/btgtickets/`

### Ver logs em tempo real:

#### Windows (PowerShell):
```powershell
Get-Content C:\BTGTicketsAPI\logs\log.txt -Wait
```

#### Linux:
```bash
tail -f /var/log/btgtickets/log.txt
```

---

## 📞 Suporte

**Desenvolvedor:** Murilo Molina  
**E-mail:** murilo.molina@gmail.com

**BTG Pactual - API Tickets V2:**
- Documentação oficial fornecida pela BTG
- Suporte técnico via canais oficiais BTG

---

## 📝 Changelog

### v1.0 - Outubro 2025
- ✅ Implementação inicial
- ✅ 7 endpoints BTG Tickets V2
- ✅ Autenticação OAuth2
- ✅ Configuração por ambiente (UAT/PRD)
- ✅ Documentação Swagger integrada
- ✅ Suporte a variáveis de ambiente

---

**Última atualização:** 27 de Outubro de 2025
