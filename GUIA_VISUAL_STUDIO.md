# 🎨 Guia Completo - Visual Studio 2022

**Autor:** Murilo Molina  
**Projeto:** BTG Tickets API

---

## 📥 PASSO 1: Download e Extração

1. **Faça download** do projeto (Download as ZIP no Replit)
2. **Extraia** para uma pasta (ex: `C:\BTGTicketsAPI`)
3. Certifique-se de ter todos os arquivos:
   - Controllers/
   - Models/
   - appsettings.json
   - Program.cs
   - BTGTicketsAPI.csproj

---

## 🔧 PASSO 2: Abrir no Visual Studio

### Opção A: Abrir Projeto Diretamente

1. Abra o **Visual Studio 2022**
2. Clique em **"Abrir um projeto ou solução"**
3. Navegue até a pasta do projeto
4. Selecione o arquivo: **BTGTicketsAPI.csproj**
5. Clique em **Abrir**

### Opção B: Abrir Pasta

1. Visual Studio → **Arquivo** → **Abrir** → **Pasta**
2. Selecione a pasta `C:\BTGTicketsAPI`
3. O VS reconhecerá automaticamente o projeto .NET

---

## ⚙️ PASSO 3: Restaurar Pacotes NuGet

Quando o projeto abrir:

1. Visual Studio mostrará uma mensagem de restauração
2. Clique em **"Restaurar"** (ou aguarde a restauração automática)
3. Verifique a janela **Output** → selecione "Package Manager"
4. Aguarde até ver: `Restore completed`

**Ou manualmente:**
- Clique com botão direito na **Solution**
- Selecione **"Restore NuGet Packages"**

---

## 🔐 PASSO 4: Configurar Variáveis de Ambiente

### No Windows (Recomendado - Permanente):

1. Pressione **Win + R**
2. Digite: `sysdm.cpl` → Enter
3. Aba **"Avançado"** → **"Variáveis de Ambiente"**
4. Em **"Variáveis do Sistema"**, clique em **"Novo"**

**Adicione:**
- Nome: `BTG_CLIENT_ID`
- Valor: `4fvga0jg4u8ui9f5p6e1ijs5mp`

**Adicione:**
- Nome: `BTG_CLIENT_SECRET`
- Valor: `121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5`

5. Clique **OK** em todas as janelas
6. **IMPORTANTE:** Feche e reabra o Visual Studio

### Ou via launchSettings.json (Temporário):

1. Abra: `Properties/launchSettings.json`
2. Adicione em `environmentVariables`:

```json
{
  "profiles": {
    "http": {
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "BTG_CLIENT_ID": "4fvga0jg4u8ui9f5p6e1ijs5mp",
        "BTG_CLIENT_SECRET": "121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5"
      }
    }
  }
}
```

---

## 📝 PASSO 5: Editar Configuração

Abra `appsettings.json` e edite:

```json
{
  "BTG": {
    "Environment": "UAT",
    "CreatedBy": "SEU_NOME_COMPLETO"
  }
}
```

Salve o arquivo (**Ctrl+S**)

---

## ▶️ PASSO 6: Executar o Projeto

### Executar em Modo Debug:

1. Pressione **F5** (ou clique no botão verde ▶️ "BTGTicketsAPI")
2. Visual Studio compilará e executará
3. Uma janela do navegador abrirá automaticamente

### Executar sem Debug:

1. Pressione **Ctrl+F5**
2. Mais rápido para testes

### O que esperar:

- Console aparecerá mostrando:
  ```
  Now listening on: http://localhost:5000
  Application started.
  ```
- Navegador abrirá em: `http://localhost:5000/swagger`

---

## 🧪 PASSO 7: Testar no Swagger

O navegador abrirá automaticamente o **Swagger UI**.

### TESTE 1: Autenticação

1. Localize: **POST /BTGTickets/autenticacao**
2. Clique em **"Try it out"**
3. Clique em **"Execute"**

**✅ Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

4. **COPIE o access_token** (você vai precisar!)

### TESTE 2: Buscar Atributos

1. Localize: **GET /BTGTickets/tickets/attributes**
2. Clique em **"Try it out"**
3. No campo **Authorization**, cole:
   ```
   Bearer SEU_TOKEN_COPIADO_AQUI
   ```
4. Clique em **"Execute"**

**✅ Resposta esperada:**
```json
{
  "channels": ["PHONE", "EMAIL"],
  "types": ["INBOUND", "OUTBOUND"],
  "terminationCodes": ["AE", "GA", "TT", "GB"]
}
```

### TESTE 3: Criar Ticket

1. Localize: **POST /BTGTickets/tickets/create**
2. Clique em **"Try it out"**
3. No campo de texto JSON, cole:

```json
{
  "AccessToken": "COLE_SEU_TOKEN_AQUI",
  "Document": "12345678901",
  "phoneAreaCode": "11",
  "phoneNumber": "987654321",
  "channel": "PHONE",
  "type": "OUTBOUND"
}
```

4. Clique em **"Execute"**

**✅ Resposta esperada:**
```json
{
  "ticketId": "uuid-do-ticket-criado",
  "status": "CREATED"
}
```

5. **COPIE o ticketId** para os próximos testes

---

## 🔍 PASSO 8: Testar via Postman (Alternativa)

Se preferir usar **Postman** em vez do Swagger:

### Importar Collection (Opcional):

1. Abra Postman
2. Crie nova requisição
3. Configure conforme exemplos abaixo

### Exemplo - Autenticação:

```
POST http://localhost:5000/BTGTickets/autenticacao
Headers:
  Content-Type: application/json
Body (raw):
  {}
```

### Exemplo - Criar Ticket:

```
POST http://localhost:5000/BTGTickets/tickets/create
Headers:
  Content-Type: application/json
Body (raw):
  {
    "AccessToken": "seu_token",
    "Document": "12345678901",
    "phoneAreaCode": "11",
    "phoneNumber": "987654321",
    "channel": "PHONE",
    "type": "OUTBOUND"
  }
```

---

## 🐛 PASSO 9: Debug no Visual Studio

### Adicionar Breakpoints:

1. Abra `Controllers/BTGTicketsController.cs`
2. Clique na **margem esquerda** ao lado da linha de código
3. Aparecerá um **círculo vermelho** (breakpoint)
4. Execute com **F5**
5. Quando a execução pausar no breakpoint:
   - **F10**: Próxima linha (Step Over)
   - **F11**: Entrar na função (Step Into)
   - **F5**: Continuar execução
   - Veja variáveis na janela **Locals**

### Ver Console/Output:

- **View** → **Output** (Ctrl+Alt+O)
- Selecione **"Debug"** no dropdown
- Veja todos os logs da aplicação

### Ver Requisições HTTP:

- **View** → **Other Windows** → **Web Development Tools**
- Ou use o **Network tab** do navegador (F12)

---

## 📊 PASSO 10: Testes Funcionais Completos

Execute todos os 7 testes conforme documentado em:
**TESTES_FUNCIONAIS.md**

### Checklist:

- [ ] ✅ Teste 1: Autenticação → Token obtido
- [ ] ✅ Teste 2: Buscar Atributos → Listas retornadas
- [ ] ✅ Teste 3: Criar Ticket → Ticket ID retornado
- [ ] ✅ Teste 4: Adicionar Contrato → Contrato vinculado
- [ ] ✅ Teste 5: Encerrar Ticket → Ticket fechado
- [ ] ✅ Teste 6: Attempt Ticket → Tentativa criada
- [ ] ✅ Teste 7: Batch Attempts → Múltiplas tentativas

---

## 🏗️ ESTRUTURA NO SOLUTION EXPLORER

```
BTGTicketsAPI
├── 📁 Dependencies
│   ├── Packages (NuGet)
│   └── Frameworks
├── 📁 Properties
│   └── launchSettings.json
├── 📁 Controllers
│   └── BTGTicketsController.cs
├── 📁 Models
│   └── 📁 BTG
│       ├── Token.cs
│       ├── CreateTicketRequest.cs
│       ├── ContractRequest.cs
│       ├── CloseTicketRequest.cs
│       └── [outros models]
├── appsettings.json
├── Program.cs
└── BTGTicketsAPI.csproj
```

---

## ⚙️ CONFIGURAÇÕES ÚTEIS NO VISUAL STUDIO

### Ver Todas as Requisições HTTP:

1. **Tools** → **Options**
2. **Debugging** → **General**
3. Marque: **"Enable Diagnostic Tools while debugging"**

### Formatar Código Automaticamente:

- **Ctrl+K, Ctrl+D** - Formatar documento inteiro
- **Ctrl+K, Ctrl+F** - Formatar seleção

### Ver Erros e Warnings:

- **View** → **Error List** (Ctrl+\, E)
- Mostra erros de compilação em tempo real

---

## 🆘 PROBLEMAS COMUNS NO VISUAL STUDIO

### Erro: "Could not find SDK"

**Solução:**
1. Instale o **.NET 8 SDK**: https://dotnet.microsoft.com/download/dotnet/8.0
2. Reinicie o Visual Studio

### Erro: "Port 5000 already in use"

**Solução:**
1. Pare a execução anterior (Shift+F5)
2. Ou edite `Properties/launchSettings.json` e mude a porta:
   ```json
   "applicationUrl": "http://localhost:5001"
   ```

### Erro: "Variáveis de ambiente não encontradas"

**Solução:**
1. Verifique se configurou as variáveis do sistema
2. **Feche e reabra** o Visual Studio completamente
3. Ou use `launchSettings.json` como mostrado acima

### Erro 403 Forbidden ao testar

**Solução:**
- Se estiver testando do **seu computador pessoal**, o IP não está liberado
- Você DEVE testar do **servidor do trabalho** onde o IP está liberado pela BTG

### NuGet não restaura

**Solução:**
1. **Tools** → **Options** → **NuGet Package Manager** → **Package Sources**
2. Certifique-se que `nuget.org` está marcado
3. Clique com botão direito na Solution → **Clean Solution**
4. Depois: **Rebuild Solution**

---

## 📖 ATALHOS ÚTEIS NO VISUAL STUDIO

| Atalho | Ação |
|--------|------|
| **F5** | Executar com Debug |
| **Ctrl+F5** | Executar sem Debug |
| **Shift+F5** | Parar Debug |
| **F9** | Adicionar/Remover Breakpoint |
| **F10** | Step Over (próxima linha) |
| **F11** | Step Into (entrar na função) |
| **Ctrl+K, Ctrl+D** | Formatar código |
| **Ctrl+Shift+B** | Build/Compilar |
| **Ctrl+.** | Quick Actions (sugestões) |

---

## 🎯 RESUMO RÁPIDO

```
1. Download ZIP do Replit
2. Extrair para C:\BTGTicketsAPI
3. Visual Studio → Abrir BTGTicketsAPI.csproj
4. Restaurar NuGet Packages
5. Configurar variáveis de ambiente (Win+R → sysdm.cpl)
6. Fechar/Reabrir Visual Studio
7. Pressionar F5
8. Swagger abre automaticamente
9. Testar endpoints
10. ✅ Pronto!
```

---

## 📞 Suporte

**Desenvolvedor:** Murilo Molina  
**E-mail:** murilo.molina@gmail.com

---

**Tempo estimado:** 10-15 minutos  
**Última atualização:** Outubro 2025
