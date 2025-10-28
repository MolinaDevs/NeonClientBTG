# 🎯 Resumo da Integração BTG Tickets + SALAJuris

**Desenvolvedor:** Murilo Molina  
**Data:** Outubro 2025

---

## ✅ O QUE FOI CRIADO

Criei uma **integração completa e pronta para uso** entre a API BTG Tickets e o seu sistema SALAJuris, com **ZERO impacto no código existente**.

---

## 📦 ARQUIVOS CRIADOS

### **1. Biblioteca JavaScript** 
📄 `wwwroot/js/btg-tickets-client.js`
- Cliente JavaScript completo
- 7 funções prontas para usar:
  - `autenticar()`
  - `criarTicket()`
  - `buscarAtributos()`
  - `adicionarContrato()`
  - `encerrarTicket()`
  - `criarAttemptTicket()`
  - `criarBatchAttempts()`

### **2. Estilos CSS**
📄 `wwwroot/css/btg-tickets.css`
- Modais profissionais
- Formulários estilizados
- Compatível com o visual do SALAJuris
- Alertas e mensagens

### **3. Exemplo Completo**
📄 `wwwroot/btg-tickets-integration.html`
- 3 modais prontos:
  - Criar Ticket
  - Adicionar Contrato
  - Encerrar Ticket
- Código funcionando 100%
- Pronto para copiar e colar

### **4. Guia de Integração**
📄 `GUIA_INTEGRACAO_SALAJURIS.md`
- Passo a passo detalhado
- Exemplos práticos
- Código para copiar
- Troubleshooting

---

## 🚀 COMO USAR NO SALAJURIS

### **Opção 1: Integração Simples (Recomendada)**

**Passo 1:** Copie 2 arquivos para o SALAJuris:
```
SALAJuris/
├── css/btg-tickets.css
└── js/btg-tickets-client.js
```

**Passo 2:** Adicione no HTML do SALAJuris:
```html
<link rel="stylesheet" href="/css/btg-tickets.css">
<script src="/js/btg-tickets-client.js"></script>
<script>
const btgClient = new BTGTicketsClient({
    apiBaseUrl: 'http://localhost:5000'
});
btgClient.autenticar();
</script>
```

**Passo 3:** Adicione um botão onde você quiser:
```html
<button onclick="criarTicketBTG()">Criar Ticket BTG</button>

<script>
function criarTicketBTG() {
    btgClient.criarTicket({
        document: '12345678901',
        phoneAreaCode: '11',
        phoneNumber: '987654321',
        channel: 'PHONE',
        type: 'OUTBOUND'
    }).then(result => {
        alert('Ticket criado! ID: ' + result.ticketId);
    });
}
</script>
```

**PRONTO!** Funciona imediatamente.

---

### **Opção 2: Integração com Modal Completo**

Copie o modal do arquivo `btg-tickets-integration.html` para o SALAJuris:

```html
<!-- Cole este modal no SALAJuris -->
<div id="modalCriarTicketBTG" class="btg-modal">
    <!-- ... código do modal ... -->
</div>
```

Depois use:
```javascript
// Abrir modal de qualquer lugar do SALAJuris
abrirModalBTG();
```

---

### **Opção 3: Integração Automática**

**Exemplo:** Criar ticket automaticamente quando incluir uma tarefa:

```javascript
// No código existente do SALAJuris
function incluirTarefa() {
    // Seu código existente aqui...
    
    // ADICIONE APENAS ISTO:
    btgClient.criarTicket({
        document: cliente.cpf,
        phoneAreaCode: cliente.ddd,
        phoneNumber: cliente.telefone,
        channel: 'PHONE',
        type: 'OUTBOUND'
    }).then(result => {
        console.log('Ticket BTG criado:', result.ticketId);
        salvarTicketNoBanco(result.ticketId);
    });
}
```

---

## 🧪 TESTAR AGORA MESMO

### **1. Ver o Exemplo Funcionando:**

```
http://localhost:5000/
```

Ou:

```
http://localhost:5000/btg-tickets-integration.html
```

### **2. API Swagger (Testes):**

```
http://localhost:5000/swagger
```

---

## 📊 FUNCIONALIDADES DISPONÍVEIS

| Função | O que faz | Uso no SALAJuris |
|--------|-----------|------------------|
| **Criar Ticket** | Cria ticket de atendimento | Ao iniciar contato com cliente |
| **Buscar Atributos** | Lista canais, tipos, códigos | Para popular dropdowns |
| **Adicionar Contrato** | Vincula contrato ao ticket | Ao negociar dívida |
| **Encerrar Ticket** | Finaliza o atendimento | Ao concluir negociação |
| **Attempt Ticket** | Tentativa de discador | Para campanhas de discagem |
| **Batch Attempts** | Múltiplas tentativas | Mailing em massa |

---

## 💡 EXEMPLOS PRÁTICOS

### **Exemplo 1: Na tela de clientes**

```javascript
// Quando exibir dados do cliente
$('.cliente-dados').each(function() {
    var cpf = $(this).data('cpf');
    var tel = $(this).data('telefone');
    
    // Adicionar botão
    $(this).append('<button onclick="criarTicketCliente(\'' + cpf + '\', \'' + tel + '\')">Criar Ticket BTG</button>');
});

function criarTicketCliente(cpf, telefone) {
    var ddd = telefone.substr(0, 2);
    var numero = telefone.substr(2);
    
    btgClient.criarTicket({
        document: cpf,
        phoneAreaCode: ddd,
        phoneNumber: numero,
        channel: 'PHONE',
        type: 'OUTBOUND'
    });
}
```

### **Exemplo 2: Integração com mailing**

```javascript
// Ao distribuir mailing
function distribuirMailing(clientes) {
    var attempts = clientes.map(c => ({
        document: c.cpf,
        phoneAreaCode: c.ddd,
        phoneNumber: c.telefone,
        channel: 'PHONE',
        type: 'OUTBOUND'
    }));
    
    btgClient.criarBatchAttempts(attempts).then(() => {
        alert(clientes.length + ' tickets criados!');
    });
}
```

### **Exemplo 3: Dashboard com estatísticas**

```javascript
// Mostrar quantos tickets BTG foram criados hoje
function atualizarDashboard() {
    $.get('/api/tickets-btg-hoje', function(data) {
        $('#ticketsBTGHoje').text(data.total);
    });
}
```

---

## 🔧 CONFIGURAÇÃO NECESSÁRIA

### **No servidor SALAJuris:**

1. **API BTG rodando:**
   ```
   http://localhost:5000
   ```

2. **Variáveis de ambiente configuradas:**
   ```
   BTG_CLIENT_ID=4fvga0jg4u8ui9f5p6e1ijs5mp
   BTG_CLIENT_SECRET=121u3fnttukef8jankq12sn4sf7mg90mcpsgvm7ktn61qni032g5
   ```

3. **Arquivos copiados:**
   - `btg-tickets.css`
   - `btg-tickets-client.js`

---

## ✅ CHECKLIST

- [ ] API BTG rodando (testada no Swagger)
- [ ] Arquivos CSS e JS copiados para o SALAJuris
- [ ] Referências adicionadas no HTML
- [ ] Cliente BTG inicializado
- [ ] Primeiro teste realizado
- [ ] Integração funcionando

---

## 🎯 PRÓXIMOS PASSOS

1. **Agora:** Teste o exemplo em `http://localhost:5000/`
2. **Depois:** Copie os 2 arquivos para o SALAJuris
3. **Por fim:** Adicione os botões onde você precisa

---

## 📞 DÚVIDAS?

Consulte o arquivo: **`GUIA_INTEGRACAO_SALAJURIS.md`**

Ou me pergunte! 😊

---

**Desenvolvedor:** Murilo Molina  
**E-mail:** murilo.molina@gmail.com
