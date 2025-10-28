# 🚀 Guia Rápido de Deploy no Servidor

**Para:** Servidor com IP liberado pela BTG  
**Autor:** Murilo Molina

---

## 📦 Passo 1: Preparar os Arquivos

### Fazer Download do Projeto

1. **Baixe todo o projeto** para sua máquina local ou servidor
2. **Estrutura esperada:**
   ```
   BTGTicketsAPI/
   ├── Controllers/
   ├── Models/
   ├── Properties/
   ├── appsettings.json
   ├── Program.cs
   ├── BTGTicketsAPI.csproj
   └── README.md
   ```

---

## ⚙️ Passo 2: Configurar no Servidor

### A) Copiar para o Servidor

```cmd
# Exemplo: Copiar para o servidor
C:\BTGTicketsAPI\
```

### B) Instalar .NET 8 SDK

Se ainda não tiver instalado:
1. Download: https://dotnet.microsoft.com/download/dotnet/8.0
2. Execute o instalador SDK x64
3. Verifique: `dotnet --version`

### C) Configurar Variáveis de Ambiente

**Windows (PowerShell - Execute como Administrador):**
```powershell
[System.Environment]::SetEnvironmentVariable('BTG_CLIENT_ID', '4fvga0jg4u8ui9f5p6e1ijs5mp', 'Machine')
[System.Environment]::SetEnvironmentVariable('BTG_CLIENT_SECRET', '121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5', 'Machine')
```

**Verificar:**
```powershell
[System.Environment]::GetEnvironmentVariable('BTG_CLIENT_ID', 'Machine')
[System.Environment]::GetEnvironmentVariable('BTG_CLIENT_SECRET', 'Machine')
```

### D) Editar Configuração (Opcional)

Edite `appsettings.json`:
```json
{
  "BTG": {
    "Environment": "UAT",
    "CreatedBy": "SEU_NOME_COMPLETO"
  }
}
```

---

## 🔨 Passo 3: Compilar e Executar

### Abrir PowerShell na Pasta do Projeto

```powershell
cd C:\BTGTicketsAPI
```

### Restaurar Dependências

```powershell
dotnet restore
```

### Compilar

```powershell
dotnet build --configuration Release
```

### Executar

```powershell
dotnet run
```

**Aguarde até ver:**
```
Now listening on: http://[::]:5000
Application started.
```

---

## 🧪 Passo 4: Testar

### Abrir Swagger UI

No navegador do servidor:
```
http://localhost:5000/swagger
```

### Teste 1: Autenticação

1. Localize: **POST /BTGTickets/autenticacao**
2. Clique em "Try it out"
3. Clique em "Execute"

**✅ Sucesso:** Retorna `access_token`  
**❌ Erro 403:** IP não liberado pela BTG

### Teste 2: Criar Ticket

1. Copie o `access_token` do teste anterior
2. Localize: **POST /BTGTickets/tickets/create**
3. Clique em "Try it out"
4. Cole este JSON:

```json
{
  "AccessToken": "COLE_O_TOKEN_AQUI",
  "Document": "12345678901",
  "phoneAreaCode": "11",
  "phoneNumber": "987654321",
  "channel": "PHONE",
  "type": "OUTBOUND"
}
```

5. Execute

**✅ Sucesso:** Retorna `ticketId`

---

## 📊 Passo 5: Testes Completos

Execute todos os testes conforme documentado em:
- **[TESTES_FUNCIONAIS.md](TESTES_FUNCIONAIS.md)**

Sequência recomendada:
1. ✅ Autenticação
2. ✅ Buscar Atributos
3. ✅ Criar Ticket
4. ✅ Adicionar Contrato
5. ✅ Encerrar Ticket
6. ✅ Criar Attempt Ticket
7. ✅ Batch Attempts

---

## 🏭 Passo 6: Deploy em Produção (Opcional)

### Como Serviço Windows

```powershell
# 1. Publicar
dotnet publish --configuration Release --output C:\inetpub\BTGTicketsAPI

# 2. Criar serviço
sc create BTGTicketsAPI binPath= "C:\inetpub\BTGTicketsAPI\BTGTicketsAPI.exe"
sc config BTGTicketsAPI start= auto
sc start BTGTicketsAPI

# 3. Verificar status
sc query BTGTicketsAPI
```

### No IIS

Consulte: **[INSTALACAO_SERVIDOR.md](INSTALACAO_SERVIDOR.md)** - Seção "Deploy no IIS"

---

## ✅ Checklist Final

- [ ] .NET 8 SDK instalado no servidor
- [ ] Projeto copiado para o servidor
- [ ] Variáveis de ambiente configuradas (BTG_CLIENT_ID e BTG_CLIENT_SECRET)
- [ ] appsettings.json editado (Environment e CreatedBy)
- [ ] dotnet restore executado sem erros
- [ ] dotnet build executado sem erros
- [ ] dotnet run executado com sucesso
- [ ] Swagger acessível em http://localhost:5000/swagger
- [ ] Teste de autenticação com sucesso (token recebido)
- [ ] Teste de criar ticket com sucesso (ticketId recebido)
- [ ] Todos os testes funcionais executados

---

## 🆘 Problemas Comuns

### "dotnet command not found"
**Solução:** .NET SDK não instalado ou não está no PATH
- Reinstale o .NET SDK
- Reinicie o PowerShell

### "Erro 403 Forbidden"
**Solução:** IP não liberado pela BTG
- Verifique com a BTG se o IP do servidor está whitelisted
- Confirme que está usando as credenciais corretas

### "Port 5000 already in use"
**Solução:** Outra aplicação usando a porta
```powershell
netstat -ano | findstr :5000
# Anote o PID e encerre:
taskkill /PID <PID> /F
```

### "Variáveis de ambiente não carregadas"
**Solução:** Reinicie o PowerShell após configurar
```powershell
# Ou configure na sessão atual:
$env:BTG_CLIENT_ID = "4fvga0jg4u8ui9f5p6e1ijs5mp"
$env:BTG_CLIENT_SECRET = "121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5"
```

---

## 📞 Suporte

**Desenvolvedor:** Murilo Molina  
**E-mail:** murilo.molina@gmail.com

**BTG Pactual:**
- Suporte técnico via canais oficiais

---

## 🎯 Resumo Rápido

```powershell
# 1. Configurar variáveis (PowerShell Admin)
[System.Environment]::SetEnvironmentVariable('BTG_CLIENT_ID', '4fvga0jg4u8ui9f5p6e1ijs5mp', 'Machine')
[System.Environment]::SetEnvironmentVariable('BTG_CLIENT_SECRET', '121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5', 'Machine')

# 2. Navegar para o projeto
cd C:\BTGTicketsAPI

# 3. Compilar e executar
dotnet restore
dotnet build --configuration Release
dotnet run

# 4. Testar
# Abra: http://localhost:5000/swagger
```

---

**Tempo estimado:** 15-30 minutos  
**Última atualização:** Outubro 2025
