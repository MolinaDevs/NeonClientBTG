# 📥 Como Fazer Download do Projeto

## ⭐ MÉTODO 1: Export as ZIP (Recomendado)

### Passo a Passo:

1. **Olhe no topo da tela do Replit** (na barra superior)
   
2. **Procure pelo ícone com três pontinhos verticais** `⋮` ou um menu
   - Geralmente fica ao lado do nome do projeto
   - Ou no canto superior direito

3. **Clique nos três pontinhos** `⋮`

4. **Procure a opção "Export as zip"** ou "Download as zip"

5. **Clique** nessa opção

6. **O download começará automaticamente**
   - Um arquivo ZIP será baixado para sua pasta de Downloads
   - Nome do arquivo será algo como: `BTGTicketsAPI.zip`

7. **Extraia o ZIP:**
   - Clique com botão direito no arquivo ZIP
   - Selecione "Extrair tudo..." ou "Extract here"
   - Escolha a pasta destino (ex: `C:\BTGTicketsAPI`)

---

## 🔧 MÉTODO 2: Via Shell (Alternativa)

Se não encontrar o botão de download, use este método:

### No Console/Shell do Replit:

```bash
# Criar arquivo ZIP de todo o projeto
zip -r BTGTicketsAPI.zip . -x "*.cache/*" "*.git/*" "bin/*" "obj/*" "node_modules/*"
```

Depois:
1. Clique no arquivo `BTGTicketsAPI.zip` que aparecerá na lista de arquivos
2. Clique com botão direito
3. Selecione "Download"

---

## 💻 MÉTODO 3: Via Git Clone (Para Usuários Avançados)

Se você tem Git instalado no seu computador:

1. **Obtenha a URL do repositório:**
   - No Replit, procure por "Version Control" ou "Git"
   - Copie a URL do repositório

2. **No seu computador**, abra PowerShell ou Terminal:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

---

## 📂 MÉTODO 4: Download Arquivo por Arquivo (Última Opção)

Se nada funcionar, você pode baixar manualmente:

1. **Na lista de arquivos à esquerda:**
   - Clique com botão direito em cada arquivo
   - Selecione "Download"

**Arquivos essenciais para baixar:**

```
✅ Controllers/BTGTicketsController.cs
✅ Models/BTG/Token.cs
✅ Models/BTG/CreateTicketRequest.cs
✅ Models/BTG/ContractRequest.cs
✅ Models/BTG/CloseTicketRequest.cs
✅ Models/BTG/TicketAttributesResponse.cs
✅ Models/BTG/CreateAttemptTicketRequest.cs
✅ Models/BTG/BasicRequest.cs
✅ Properties/launchSettings.json
✅ appsettings.json
✅ appsettings.EXAMPLE.json
✅ Program.cs
✅ BTGTicketsAPI.csproj
✅ .gitignore
✅ README.md
✅ INSTALACAO_SERVIDOR.md
✅ TESTES_FUNCIONAIS.md
✅ GUIA_VISUAL_STUDIO.md
✅ GUIA_DEPLOY_SERVIDOR.md
✅ PASSO_A_PASSO_SERVIDOR.txt
✅ RESUMO_PROJETO.txt
✅ setup-servidor.ps1
```

---

## 🎯 Onde está o botão?

### Localizações possíveis do botão de download:

```
╔══════════════════════════════════════════════╗
║  [Logo] BTGTicketsAPI        ⋮  [Deploy]    ║  ← Procure aqui (⋮)
╠══════════════════════════════════════════════╣
║                                              ║
║  Arquivos │ Code │ Tools │ Settings         ║
║                                              ║
╚══════════════════════════════════════════════╝
```

Ou:

```
╔══════════════════════════════════════════════╗
║  File  Edit  View  Tools  Help         ⋮    ║  ← Ou aqui
╠══════════════════════════════════════════════╣
```

**Ao clicar no ⋮ você verá algo como:**

```
┌─────────────────────┐
│ Share               │
│ Export as zip       │ ← ESTE É O BOTÃO!
│ Settings            │
│ ...                 │
└─────────────────────┘
```

---

## ✅ Depois de Baixar e Extrair

1. **Abra a pasta** onde extraiu (ex: `C:\BTGTicketsAPI`)

2. **Verifique se tem estes arquivos:**
   - `BTGTicketsAPI.csproj` ✅
   - `Program.cs` ✅
   - Pasta `Controllers/` ✅
   - Pasta `Models/` ✅

3. **Pronto!** Agora siga o arquivo: **GUIA_VISUAL_STUDIO.md**

---

## 🆘 Não está funcionando?

**Me avise qual mensagem de erro aparece!**

Possíveis problemas:

- ❌ "Precisa de permissão" → Você precisa ser o dono do Repl
- ❌ "Feature não disponível" → Use o Método 2 (Shell)
- ❌ "Arquivo muito grande" → Use o Método 3 (Git)

---

**Desenvolvedor:** Murilo Molina  
**Atualizado:** Outubro 2025
