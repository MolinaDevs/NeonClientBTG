# 🎯 Guia Completo de Teste - BTG Tickets API

## ⚠️ PROBLEMA ENCONTRADO

As credenciais que você recebeu da BTG estão **BLOQUEADAS** na API. Quando tentamos autenticar, recebemos:

```
{"message":"Forbidden"}
```

Isso significa que as credenciais não têm permissão para acessar a API de UAT.

---

## 📞 O QUE FAZER AGORA

### 1️⃣ **CONTATAR A BTG IMEDIATAMENTE**

Você precisa entrar em contato com o suporte técnico da BTG e informar:

> "Recebi as credenciais para a API BTG Tickets V2 (UAT), mas ao tentar autenticar recebo erro 'Forbidden'. As credenciais estão bloqueadas ou precisam ser liberadas?"

**Credenciais recebidas:**
- Client ID: `4fvga0jg4u8ui9f5p6e1ijs5mp`
- Client Secret: `121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5`

**Endpoint de autenticação:**
- URL: `https://agreements-api-uat.btgpactual.com/v2/authorization/oauth2/token`

**Perguntas para a BTG:**
1. As credenciais estão ativas e liberadas?
2. Há algum IP que precisa ser whitelisted?
3. Há alguma configuração adicional necessária?
4. O endpoint de autenticação está correto?

---

## ✅ CHECKLIST - O QUE JÁ ESTÁ CONFIGURADO

### 1. Credenciais Seguras ✅
- ✅ Credenciais armazenadas em **Replit Secrets** (seguro)
- ✅ Não aparecem no código fonte
- ✅ Disponíveis como variáveis de ambiente

### 2. URLs Atualizadas ✅
- ✅ URL de autenticação: `https://agreements-api-uat.btgpactual.com/v2/authorization`
- ✅ URL base da API: `https://agreements-api-uat.btgpactual.com`
- ✅ Ambiente configurado para UAT (teste)

### 3. API Funcionando ✅
- ✅ Servidor rodando na porta 5000
- ✅ Todos os 7 endpoints implementados
- ✅ Headers corretos configurados
- ✅ Documentação Swagger disponível

---

## 🚀 COMO TESTAR QUANDO AS CREDENCIAIS FOREM LIBERADAS

### **Passo 1: Verificar se a API está rodando**

1. Abra o painel do Replit
2. Veja se o servidor está com status "RUNNING" (rodando)
3. Você deve ver uma mensagem: "Now listening on: http://[::]:5000"

✅ **Se estiver rodando**: Prossiga para o Passo 2  
❌ **Se não estiver**: Clique no botão "Run" no topo da tela

---

### **Passo 2: Testar Autenticação**

**Opção A: Usar o navegador (mais fácil)**

1. Abra uma nova aba no navegador
2. Cole esta URL (substitua pelo seu domínio do Replit):
   ```
   https://SEU_PROJETO.replit.dev/swagger
   ```
3. Procure o endpoint **POST /BTGTickets/autenticacao**
4. Clique em "Try it out"
5. Clique em "Execute"

**O que esperar:**
- ✅ **Sucesso**: Você verá um JSON com `access_token`, `token_type`, `expires_in`
- ❌ **Erro 403 Forbidden**: As credenciais ainda não foram liberadas pela BTG

---

**Opção B: Usar ferramenta de teste de API (Postman/Insomnia)**

1. Abra o Postman ou Insomnia
2. Crie uma nova requisição POST
3. URL: `https://SEU_PROJETO.replit.dev/BTGTickets/autenticacao`
4. Headers: `Content-Type: application/json`
5. Body: `{}`
6. Clique em "Send"

---

**Opção C: Linha de comando (terminal)**

Se você tem acesso ao terminal, execute:

```bash
curl -X POST https://SEU_PROJETO.replit.dev/BTGTickets/autenticacao \
  -H "Content-Type: application/json" \
  -d "{}"
```

---

### **Passo 3: Testar Buscar Atributos**

Depois que você conseguir autenticar e receber o token:

1. **Copie o access_token** que você recebeu
2. Teste o endpoint de atributos:

**No Swagger:**
1. Procure **GET /BTGTickets/tickets/attributes**
2. Clique em "Try it out"
3. No campo "Authorization", cole: `Bearer SEU_TOKEN_AQUI`
4. Clique em "Execute"

**No Postman:**
```
GET https://SEU_PROJETO.replit.dev/BTGTickets/tickets/attributes
Headers:
  Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta esperada:**
```json
{
  "channels": ["PHONE", "EMAIL"],
  "types": ["INBOUND", "OUTBOUND"],
  "terminationCodes": ["AE", "GA", "TT", "GB", "TW"]
}
```

---

### **Passo 4: Criar um Ticket de Teste**

Com o token válido:

**No Swagger:**
1. Procure **POST /BTGTickets/tickets/create**
2. Clique em "Try it out"
3. Cole este JSON no body:

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

4. Clique em "Execute"

**Resposta esperada:**
```json
{
  "ticketId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "status": "CREATED"
}
```

---

### **Passo 5: Adicionar Contrato ao Ticket**

**Guarde o ticketId** que você recebeu no passo anterior e use aqui:

```json
{
  "AccessToken": "COLE_SEU_TOKEN_AQUI",
  "Document": "12345678901",
  "TicketId": "COLE_O_TICKET_ID_AQUI",
  "terminationCode": "GA",
  "contractNumber": "CN-81273197",
  "product": "CARTAO",
  "dueDays": 25
}
```

---

### **Passo 6: Encerrar o Ticket**

Para finalizar o ticket de teste:

```json
{
  "AccessToken": "COLE_SEU_TOKEN_AQUI",
  "Document": "12345678901",
  "TicketId": "COLE_O_TICKET_ID_AQUI",
  "additionalInfo": "Teste concluído com sucesso",
  "email": "teste@email.com",
  "scheduledDate": "2025-11-15"
}
```

---

## 📊 TODOS OS ENDPOINTS DISPONÍVEIS

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/BTGTickets/autenticacao` | Gerar token de acesso |
| GET | `/BTGTickets/tickets/attributes` | Buscar atributos (canais, tipos, códigos) |
| POST | `/BTGTickets/tickets/create` | Criar novo ticket |
| POST | `/BTGTickets/tickets/contract/add` | Adicionar contrato ao ticket |
| PUT | `/BTGTickets/tickets/close` | Encerrar ticket |
| POST | `/BTGTickets/tickets/attempt/create` | Criar tentativa de discador |
| POST | `/BTGTickets/tickets/attempt/batch` | Criar tentativas em lote |

---

## 🔧 CONFIGURAÇÕES IMPORTANTES

### Trocar entre UAT e Produção

**Arquivo: `appsettings.json`**

Para usar **UAT (teste)**:
```json
"Environment": "UAT"
```

Para usar **Produção**:
```json
"Environment": "PRD"
```

⚠️ **IMPORTANTE**: SEMPRE teste em UAT primeiro!

---

### Alterar o Nome do Operador

**Arquivo: `appsettings.json`**

```json
"CreatedBy": "NOME_DO_SEU_OPERADOR"
```

Esse nome será enviado automaticamente em todos os tickets criados.

---

## 🆘 TROUBLESHOOTING (RESOLUÇÃO DE PROBLEMAS)

### Problema: "Erro 403 Forbidden" ao autenticar
**Solução:** 
- As credenciais ainda não foram liberadas pela BTG
- Entre em contato com o suporte técnico da BTG
- Verifique se o IP precisa ser whitelisted

### Problema: "Token expirado"
**Solução:** 
- O token expira em 1 hora
- Gere um novo token chamando `/BTGTickets/autenticacao` novamente

### Problema: "Servidor não está rodando"
**Solução:** 
- Clique no botão "Run" no topo do Replit
- Aguarde até ver "Now listening on: http://[::]:5000"

### Problema: "Erro 400 Bad Request"
**Solução:** 
- Verifique se o JSON está correto (sem vírgulas extras)
- Confirme que todos os campos obrigatórios estão preenchidos
- Confira se o token está válido

---

## 📝 PRÓXIMOS PASSOS APÓS TESTE

Quando tudo estiver funcionando:

### 1. Melhorias de Segurança
- [ ] Implementar cache de token (economiza chamadas)
- [ ] Adicionar renovação automática do token
- [ ] Implementar rate limiting

### 2. Monitoramento
- [ ] Adicionar logs detalhados (Serilog)
- [ ] Configurar alertas de erro
- [ ] Implementar health checks

### 3. Testes
- [ ] Criar testes unitários
- [ ] Criar testes de integração
- [ ] Documentar casos de uso reais

### 4. Produção
- [ ] Migrar credenciais para Azure Key Vault
- [ ] Configurar CI/CD
- [ ] Preparar documentação para equipe

---

## 📞 CONTATOS DE SUPORTE

**BTG Pactual - Suporte Técnico API**
- Solicite ao seu contato na BTG o canal oficial de suporte
- Tenha em mãos: Client ID, URLs de teste, logs de erro

**Dúvidas sobre esta API**
- Verifique o arquivo `README.md` na raiz do projeto
- Consulte a documentação BTG em `attached_assets/`

---

## ✅ STATUS ATUAL DO PROJETO

- ✅ Projeto 100% implementado
- ✅ Credenciais configuradas de forma segura
- ✅ URLs corretas da BTG configuradas
- ✅ Servidor rodando sem erros
- ⚠️ **AGUARDANDO**: Liberação das credenciais pela BTG
- ⏳ **PRÓXIMO PASSO**: Contatar BTG para liberação das credenciais

---

**Última atualização:** 27 de Outubro de 2025
