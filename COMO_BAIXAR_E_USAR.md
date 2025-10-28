# 📥 Como Baixar e Usar o Projeto BTG Tickets API

**Desenvolvedor:** Murilo Molina  
**Data:** Outubro 2025

---

## 🎯 PASSO 1: BAIXAR O PROJETO COMPLETO

### **Opção A: Baixar via Replit (Recomendado)**

1. **No Replit (nesta página):**
   - Clique no menu **três pontos** (⋮) ao lado do nome do projeto
   - Selecione **"Download as ZIP"**
   - Salve o arquivo no seu computador

2. **Extrair o ZIP:**
   - Clique com botão direito no arquivo baixado
   - **Extrair tudo...**
   - Escolha uma pasta (ex: `C:\Projetos\BTGTicketsAPI`)

### **Opção B: Baixar Arquivos Individuais**

Se preferir baixar apenas os arquivos essenciais:

**Arquivos obrigatórios:**
- ✅ `Program.cs`
- ✅ `BTGTicketsAPI.csproj`
- ✅ `appsettings.json`
- ✅ Pasta `Controllers/` completa
- ✅ Pasta `Models/` completa
- ✅ Pasta `wwwroot/` completa (IMPORTANTE!)

---

## 🎯 PASSO 2: ABRIR NO VISUAL STUDIO

### **1. Abrir o Visual Studio 2022**

### **2. Abrir o projeto:**
   - **File** → **Open** → **Project/Solution**
   - Navegue até a pasta onde extraiu
   - Selecione o arquivo **`BTGTicketsAPI.csproj`**
   - Clique em **Open**

### **3. Verificar a estrutura:**

No **Solution Explorer**, você deve ver:

```
📁 BTGTicketsAPI
  📁 wwwroot                    ← IMPORTANTE! Deve estar aqui
    📁 css
      📄 btg-tickets.css
    📁 js
      📄 btg-tickets-client.js
    📄 index.html
    📄 teste-simples.html
    📄 btg-tickets-integration.html
  📁 Controllers
    📄 BTGTicketsController.cs
  📁 Models
    📄 BTGTicketModels.cs
  📄 Program.cs
  📄 appsettings.json
  📄 BTGTicketsAPI.csproj
```

**Se a pasta `wwwroot` não aparecer:**
- Clique em **Show All Files** no Solution Explorer (ícone de pasta com olho)
- Clique com botão direito em `wwwroot` → **Include in Project**

---

## 🎯 PASSO 3: CONFIGURAR AS CREDENCIAIS BTG

### **1. Abrir o arquivo `appsettings.json`**

### **2. Verificar se está assim:**

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "Btg": {
    "Environment": "UAT",
    "Endpoints": {
      "UAT": {
        "ApiUrl": "https://agreements-api-uat.btgpactual.com/v2",
        "AuthUrl": "https://agreements-api-uat.btgpactual.com/v2/authorization/oauth2/token"
      }
    },
    "Credentials": {
      "ClientId": "4fvga0jg4u8ui9f5p6e1ijs5mp",
      "ClientSecret": "121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5"
    }
  }
}
```

**IMPORTANTE:** As credenciais já estão configuradas. Se precisar alterar para produção, mude apenas o `Environment` para `"PROD"`.

---

## 🎯 PASSO 4: RESTAURAR DEPENDÊNCIAS

### **No Visual Studio:**

1. **Clique com botão direito no projeto** (no Solution Explorer)
2. **Restore NuGet Packages**
3. Aguarde a mensagem: **"Restore completed"**

---

## 🎯 PASSO 5: COMPILAR E RODAR

### **1. Compilar:**
   - **Build** → **Build Solution** (ou Ctrl + Shift + B)
   - Aguarde: **"Build succeeded"**

### **2. Rodar:**
   - Pressione **F5** (ou clique no botão verde ▶️)
   - Aguarde aparecer no console:
     ```
     Now listening on: http://localhost:5000
     Application started.
     ```

---

## 🎯 PASSO 6: TESTAR NO NAVEGADOR

### **1. Abrir o navegador**

### **2. Acessar:**
```
http://localhost:5000/
```

### **3. Deve aparecer:**
- ✅ Página roxa com gradiente
- ✅ Título: "API BTG Tickets Funcionando!"
- ✅ Marca verde ✅
- ✅ Botões: "Página de Testes", "Exemplo Completo", "Swagger"

---

## 🧪 PASSO 7: TESTAR AS FUNCIONALIDADES

### **Teste 1: Página Inicial**
```
http://localhost:5000/
```
✅ Deve abrir a página de boas-vindas

### **Teste 2: Testes Interativos**
```
http://localhost:5000/teste-simples.html
```
✅ Página com botões para testar todas as funções

### **Teste 3: Exemplo Completo**
```
http://localhost:5000/btg-tickets-integration.html
```
✅ Interface completa com modais

### **Teste 4: Swagger API**
```
http://localhost:5000/swagger
```
✅ Documentação interativa da API

---

## 🎯 PASSO 8: INTEGRAR COM SALAJURIS

### **Depois de confirmar que tudo funciona:**

1. Mantenha esta API rodando (porta 5000)
2. No SALAJuris, siga o guia: **`GUIA_INTEGRACAO_SALAJURIS.md`**
3. Copie os arquivos `wwwroot/css/` e `wwwroot/js/` para o SALAJuris
4. Adicione os botões conforme exemplos do guia

---

## 📊 CHECKLIST COMPLETO

- [ ] ✅ Projeto baixado e extraído
- [ ] ✅ Aberto no Visual Studio 2022
- [ ] ✅ Pasta `wwwroot` existe no Solution Explorer
- [ ] ✅ Credenciais BTG no `appsettings.json`
- [ ] ✅ NuGet Packages restaurados
- [ ] ✅ Projeto compilado sem erros
- [ ] ✅ Aplicação rodando (F5)
- [ ] ✅ Navegador mostra página em `http://localhost:5000/`
- [ ] ✅ Swagger funciona em `/swagger`
- [ ] ✅ Testes funcionam em `/teste-simples.html`

---

## ⚠️ PROBLEMAS COMUNS

### **Erro: "Pasta wwwroot não encontrada"**

**Solução:**
1. No Solution Explorer, clique em **Show All Files**
2. Localize a pasta `wwwroot`
3. Clique com botão direito → **Include in Project**

---

### **Erro: "Port 5000 already in use"**

**Solução:**
1. Pare outros processos usando porta 5000
2. Ou altere a porta no `Program.cs`:
   ```csharp
   options.ListenAnyIP(5001); // Troque 5000 por 5001
   ```

---

### **Erro 404 ao acessar arquivos HTML**

**Solução:**
1. Verifique se `Program.cs` tem: `app.UseStaticFiles();`
2. Verifique se os arquivos estão em `wwwroot/` (não na raiz)
3. Pare e reinicie a aplicação (Shift+F5, depois F5)

---

### **Erro 403 Forbidden da API BTG**

**Normal!** Se você está testando de casa/escritório:
- A API BTG só funciona com IP liberado
- **No servidor da empresa funcionará normalmente**
- Para testar localmente, use o Swagger para simular

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Agora:** Baixe e teste localmente
2. ✅ **Depois:** Integre com SALAJuris (veja `GUIA_INTEGRACAO_SALAJURIS.md`)
3. ✅ **Por fim:** Deploy no servidor (veja `GUIA_DEPLOY_SERVIDOR.md`)

---

## 📁 ARQUIVOS IMPORTANTES

| Arquivo | Descrição |
|---------|-----------|
| `GUIA_INTEGRACAO_SALAJURIS.md` | Como integrar no SALAJuris |
| `RESUMO_INTEGRACAO.md` | Resumo executivo |
| `GUIA_DEPLOY_SERVIDOR.md` | Deploy em servidor Windows |
| `COMO_TESTAR_NO_VISUAL_STUDIO.md` | Troubleshooting Visual Studio |

---

## 📞 SUPORTE

**Desenvolvedor:** Murilo Molina  
**E-mail:** murilo.molina@gmail.com

**Documentação completa:** Veja os arquivos `.md` incluídos no projeto

---

**Última atualização:** Outubro 2025

✅ **PROJETO PRONTO PARA USO!**
