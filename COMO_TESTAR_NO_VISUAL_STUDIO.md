# 🎯 Como Testar no Visual Studio (Passo a Passo)

**Para:** Murilo Molina  
**Problema:** Página não abre (erro 404) ao acessar `http://localhost:5000/btg-tickets-integration.html`

---

## ✅ PASSO 1: Verificar se os Arquivos Estão no Lugar Certo

### **No Visual Studio:**

1. **Abra o "Solution Explorer"** (Ctrl + Alt + L)

2. **Verifique se existe a pasta `wwwroot`:**
   ```
   BTGTicketsAPI/
   ├── wwwroot/              ← Deve existir esta pasta
   │   ├── css/
   │   │   └── btg-tickets.css
   │   ├── js/
   │   │   └── btg-tickets-client.js
   │   ├── btg-tickets-integration.html
   │   └── teste-simples.html
   ├── Controllers/
   ├── Program.cs
   └── BTGTicketsAPI.csproj
   ```

3. **Se a pasta `wwwroot` NÃO existir:**
   - Clique com botão direito no projeto
   - **Add** → **New Folder**
   - Nome: `wwwroot`

4. **Criar a estrutura completa:**
   - Dentro de `wwwroot`, criar pasta `css`
   - Dentro de `wwwroot`, criar pasta `js`
   - Copiar os arquivos para os lugares corretos

---

## ✅ PASSO 2: Copiar os Arquivos (Se Ainda Não Fez)

### **Opção A: Criar Manualmente no Visual Studio**

**1. Criar `wwwroot/css/btg-tickets.css`:**
   - Botão direito em `wwwroot/css`
   - **Add** → **New Item**
   - Escolher **Style Sheet**
   - Nome: `btg-tickets.css`
   - Copiar o conteúdo do arquivo aqui do projeto

**2. Criar `wwwroot/js/btg-tickets-client.js`:**
   - Botão direito em `wwwroot/js`
   - **Add** → **New Item**
   - Escolher **JavaScript File**
   - Nome: `btg-tickets-client.js`
   - Copiar o conteúdo do arquivo aqui do projeto

**3. Criar `wwwroot/teste-simples.html`:**
   - Botão direito em `wwwroot`
   - **Add** → **New Item**
   - Escolher **HTML Page**
   - Nome: `teste-simples.html`
   - Copiar o conteúdo do arquivo aqui do projeto

---

## ✅ PASSO 3: Verificar o Program.cs

### **Abra o arquivo `Program.cs` e certifique-se que tem estas linhas:**

```csharp
var app = builder.Build();

// ESTAS LINHAS DEVEM ESTAR AQUI:
app.UseStaticFiles();  // ← IMPORTANTE!
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/", () => Results.Redirect("/teste-simples.html"));

app.MapControllers();

app.Run();
```

### **Se não tiver `app.UseStaticFiles();`:**

1. Localize a linha `var app = builder.Build();`
2. Logo abaixo, adicione:
   ```csharp
   app.UseStaticFiles();
   ```

---

## ✅ PASSO 4: Parar e Reiniciar a Aplicação

### **No Visual Studio:**

1. **Parar a aplicação:**
   - Clique no botão vermelho **⬛ Stop** (ou Shift + F5)
   - Aguarde até parar completamente

2. **Iniciar novamente:**
   - Pressione **F5** (ou clique no botão ▶️ verde)
   - Aguarde aparecer no console:
     ```
     Now listening on: http://localhost:5000
     Application started.
     ```

---

## ✅ PASSO 5: Testar no Navegador

### **1. Abrir a página de testes:**

No navegador, digite:
```
http://localhost:5000/teste-simples.html
```

### **2. O que deve acontecer:**

- ✅ Deve abrir uma página com título **"Teste BTG Tickets API"**
- ✅ Deve ter vários botões de teste
- ✅ Deve autenticar automaticamente ao carregar

### **3. Se continuar dando erro 404:**

Tente acessar diretamente:
```
http://localhost:5000/swagger
```

- Se **Swagger abrir**: API está rodando, problema é nos arquivos estáticos
- Se **Swagger não abrir**: API não está rodando na porta 5000

---

## ⚠️ SOLUÇÃO DE PROBLEMAS

### **Problema 1: Erro 404 persistente**

**Causa:** Arquivos não estão sendo incluídos no build

**Solução:**

1. **No Solution Explorer**, clique em cada arquivo dentro de `wwwroot`
2. **Pressione F4** para abrir Properties
3. Verifique se:
   - **Build Action** = `Content`
   - **Copy to Output Directory** = `Copy if newer`

**Ou edite manualmente o `.csproj`:**

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>

  <!-- ADICIONE ISTO -->
  <ItemGroup>
    <Content Include="wwwroot\**\*" CopyToOutputDirectory="PreserveNewest" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.0.18" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.6.2" />
  </ItemGroup>
</Project>
```

Depois:
- Salve o `.csproj`
- **Build** → **Rebuild Solution**
- **F5** para rodar novamente

---

### **Problema 2: Porta errada**

**Verifique qual porta está rodando:**

No console do Visual Studio (Output), procure por:
```
Now listening on: http://localhost:XXXX
```

Se a porta for diferente de 5000, use essa porta no navegador.

---

### **Problema 3: UseStaticFiles não reconhecido**

**Se der erro ao compilar `app.UseStaticFiles();`:**

Certifique-se que o `.csproj` tem:
```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
```

E **NÃO**:
```xml
<Project Sdk="Microsoft.NET.Sdk">
```

O `Sdk.Web` já inclui o middleware de arquivos estáticos.

---

## ✅ TESTE ALTERNATIVO: Swagger

### **Se os arquivos HTML não funcionarem, teste via Swagger:**

1. Acesse: `http://localhost:5000/swagger`

2. Teste o endpoint **POST /BTGTickets/autenticacao**
   - Clique em **Try it out**
   - Clique em **Execute**
   - Deve retornar um `access_token`

3. Se Swagger funcionar, sua API está OK
   - O problema é só nos arquivos estáticos
   - Continue no Passo 1 deste guia

---

## 📊 CHECKLIST COMPLETO

- [ ] Pasta `wwwroot` existe no projeto
- [ ] Arquivos `.html`, `.css`, `.js` estão dentro de `wwwroot`
- [ ] `Program.cs` tem a linha `app.UseStaticFiles();`
- [ ] Aplicação foi **parada e reiniciada** após as mudanças
- [ ] Navegador acessa `http://localhost:5000/teste-simples.html`
- [ ] Página abre sem erro 404

---

## 🎯 RESUMO

```
1. Criar pasta wwwroot/
2. Copiar arquivos para wwwroot/
3. Adicionar app.UseStaticFiles() no Program.cs
4. Parar aplicação (Shift + F5)
5. Iniciar aplicação (F5)
6. Abrir http://localhost:5000/teste-simples.html
```

---

## 📞 AINDA NÃO FUNCIONOU?

**Me envie:**
1. Screenshot do Solution Explorer mostrando a estrutura de pastas
2. Screenshot do erro no navegador
3. O conteúdo do seu `Program.cs`

---

**Desenvolvedor:** Murilo Molina  
**Última atualização:** Outubro 2025
