# 🔗 Guia de Integração BTG Tickets com SALAJuris

**Desenvolvedor:** Murilo Molina  
**Sistema:** SALAJuris (Araujo & Augusto)  
**Data:** Outubro 2025

---

## 📋 Visão Geral

Este guia mostra como integrar a API BTG Tickets no seu sistema SALAJuris existente **sem alterar o código principal**, apenas adicionando novos arquivos e pequenos trechos de código.

---

## 📦 Arquivos Criados para Integração

```
wwwroot/
├── css/
│   └── btg-tickets.css              # Estilos dos modais e formulários
├── js/
│   └── btg-tickets-client.js        # Biblioteca JavaScript para chamar a API
└── btg-tickets-integration.html      # Exemplo completo de integração
```

---

## 🚀 Passo 1: Copiar Arquivos para o SALAJuris

### **No seu servidor SALAJuris:**

1. **Copie a pasta `wwwroot`** completa para dentro do projeto SALAJuris
   
2. **Estrutura sugerida:**
   ```
   SALAJuris/
   ├── css/
   │   └── btg-tickets.css          ← Adicione este arquivo
   ├── js/
   │   └── btg-tickets-client.js    ← Adicione este arquivo
   └── [outros arquivos do SALAJuris]
   ```

---

## 🔧 Passo 2: Incluir CSS e JS nas Páginas do SALAJuris

### **No HTML principal do SALAJuris** (geralmente `_Layout.cshtml`, `master.page`, ou `index.html`):

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Seus CSS existentes -->
    <link rel="stylesheet" href="seu-css-existente.css">
    
    <!-- ADICIONE ISTO: CSS BTG Tickets -->
    <link rel="stylesheet" href="/css/btg-tickets.css">
</head>
<body>
    <!-- Conteúdo do SALAJuris -->
    
    <!-- Seus scripts existentes -->
    <script src="jquery.js"></script>
    <script src="seu-script-existente.js"></script>
    
    <!-- ADICIONE ISTO: JavaScript BTG Tickets -->
    <script src="/js/btg-tickets-client.js"></script>
    <script>
        // Inicializar cliente BTG
        const btgClient = new BTGTicketsClient({
            apiBaseUrl: 'http://localhost:5000', // URL da sua API BTG
            onError: function(msg) { alert('Erro BTG: ' + msg); },
            onSuccess: function(msg) { alert('Sucesso: ' + msg); }
        });
        
        // Autenticar automaticamente
        btgClient.autenticar().then(() => {
            console.log('BTG Tickets pronto!');
        });
    </script>
</body>
</html>
```

---

## 🎯 Passo 3: Adicionar Botões no SALAJuris

### **Exemplo 1: Adicionar botão na tela de clientes**

```html
<!-- Onde você mostra os dados do cliente -->
<div class="cliente-info">
    <p>Nome: João Silva</p>
    <p>CPF: 12345678901</p>
    <p>Telefone: (11) 98765-4321</p>
    
    <!-- ADICIONE ESTE BOTÃO -->
    <button onclick="criarTicketBTG('12345678901', '11', '987654321')" 
            class="btg-btn btg-btn-primary">
        📞 Criar Ticket BTG
    </button>
</div>
```

### **JavaScript para o botão:**

```javascript
function criarTicketBTG(cpf, ddd, telefone) {
    btgClient.criarTicket({
        document: cpf,
        phoneAreaCode: ddd,
        phoneNumber: telefone,
        channel: 'PHONE',
        type: 'OUTBOUND'
    }).then(function(result) {
        alert('Ticket criado! ID: ' + result.ticketId);
        
        // IMPORTANTE: Salve o ticketId no seu banco de dados
        salvarTicketNoBanco(cpf, result.ticketId);
    });
}

// Função para salvar no seu banco (adapte conforme seu sistema)
function salvarTicketNoBanco(cpf, ticketId) {
    // Exemplo com jQuery AJAX
    $.ajax({
        url: '/api/salvar-ticket-btg',
        method: 'POST',
        data: { cpf: cpf, btgTicketId: ticketId },
        success: function() {
            console.log('Ticket salvo no banco');
        }
    });
}
```

---

## 💡 Passo 4: Adicionar Modal Completo (Opcional)

Se quiser um modal completo igual aos do SALAJuris, copie este código:

### **HTML do Modal:**

```html
<!-- Adicione este HTML no final da sua página principal -->
<div id="modalCriarTicketBTG" class="btg-modal">
    <div class="btg-modal-content">
        <div class="btg-modal-header">
            <h3>Criar Ticket de Atendimento BTG</h3>
            <button class="btg-close" onclick="fecharModalBTG()">&times;</button>
        </div>
        <div class="btg-modal-body">
            <div id="alertBTG"></div>
            
            <form id="formTicketBTG">
                <div class="btg-form-group">
                    <label>CPF/CNPJ *</label>
                    <input type="text" id="btg_cpf" required>
                </div>
                
                <div class="btg-form-row">
                    <div class="btg-form-group">
                        <label>DDD *</label>
                        <input type="text" id="btg_ddd" required maxlength="2">
                    </div>
                    <div class="btg-form-group">
                        <label>Telefone *</label>
                        <input type="text" id="btg_telefone" required>
                    </div>
                </div>
                
                <div class="btg-form-group">
                    <label>Canal *</label>
                    <select id="btg_canal" required>
                        <option value="PHONE">Telefone</option>
                        <option value="EMAIL">E-mail</option>
                    </select>
                </div>
                
                <div class="btg-form-group">
                    <label>Tipo *</label>
                    <select id="btg_tipo" required>
                        <option value="INBOUND">Entrada</option>
                        <option value="OUTBOUND">Saída</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="btg-modal-footer">
            <button class="btg-btn btg-btn-secondary" onclick="fecharModalBTG()">Cancelar</button>
            <button class="btg-btn btg-btn-success" onclick="submitTicketBTG()">Criar Ticket</button>
        </div>
    </div>
</div>
```

### **JavaScript do Modal:**

```javascript
function abrirModalBTG() {
    document.getElementById('modalCriarTicketBTG').style.display = 'block';
}

function fecharModalBTG() {
    document.getElementById('modalCriarTicketBTG').style.display = 'none';
}

function submitTicketBTG() {
    const dados = {
        document: document.getElementById('btg_cpf').value,
        phoneAreaCode: document.getElementById('btg_ddd').value,
        phoneNumber: document.getElementById('btg_telefone').value,
        channel: document.getElementById('btg_canal').value,
        type: document.getElementById('btg_tipo').value
    };
    
    btgClient.criarTicket(dados).then(function(result) {
        document.getElementById('alertBTG').innerHTML = 
            '<div class="btg-alert btg-alert-success">Ticket criado! ID: ' + result.ticketId + '</div>';
        
        setTimeout(fecharModalBTG, 2000);
    }).catch(function(error) {
        document.getElementById('alertBTG').innerHTML = 
            '<div class="btg-alert btg-alert-error">Erro: ' + error.message + '</div>';
    });
}
```

---

## 🔄 Passo 5: Integração com Eventos Existentes

### **Exemplo: Criar ticket automaticamente ao fazer uma tarefa**

```javascript
// No seu código existente do SALAJuris, quando criar uma tarefa:

function incluirTarefa() {
    // Seu código existente
    var cliente = obterClienteSelecionado();
    
    // ADICIONE ISTO: Criar ticket BTG automaticamente
    btgClient.criarTicket({
        document: cliente.cpf,
        phoneAreaCode: cliente.ddd,
        phoneNumber: cliente.telefone,
        channel: 'PHONE',
        type: 'OUTBOUND'
    }).then(function(result) {
        console.log('Ticket BTG criado automaticamente:', result.ticketId);
        
        // Salvar o ticketId junto com a tarefa
        salvarTarefaComTicketBTG(cliente.id, result.ticketId);
    });
}
```

---

## 📊 Passo 6: Criar Tabela no Banco de Dados (Sugestão)

Para rastrear os tickets BTG no SALAJuris, crie uma tabela:

```sql
CREATE TABLE BTGTickets (
    Id INT PRIMARY KEY IDENTITY(1,1),
    ClienteId INT NOT NULL,
    CPF VARCHAR(14) NOT NULL,
    TicketIdBTG VARCHAR(50) NOT NULL,
    DataCriacao DATETIME DEFAULT GETDATE(),
    Status VARCHAR(20) DEFAULT 'ATIVO',
    Observacoes TEXT,
    
    FOREIGN KEY (ClienteId) REFERENCES Clientes(Id)
);
```

---

## ⚙️ Passo 7: Configurar URL da API

### **Altere o URL da API conforme seu ambiente:**

```javascript
// Desenvolvimento (localhost)
const btgClient = new BTGTicketsClient({
    apiBaseUrl: 'http://localhost:5000'
});

// Produção (servidor)
const btgClient = new BTGTicketsClient({
    apiBaseUrl: 'http://seu-servidor:5000'
});
```

---

## 🧪 Passo 8: Testar a Integração

### **Teste 1: Botão Simples**

1. Adicione um botão em qualquer página do SALAJuris
2. Clique no botão
3. Verifique se o ticket foi criado no console
4. Verifique se aparece no Swagger: `http://localhost:5000/swagger`

### **Teste 2: Modal Completo**

1. Abra o modal
2. Preencha os campos
3. Clique em "Criar Ticket"
4. Deve mostrar mensagem de sucesso com o Ticket ID

### **Teste 3: Integração Automática**

1. Realize uma ação normal do SALAJuris (ex: criar tarefa)
2. Verifique se o ticket BTG foi criado automaticamente
3. Verifique no banco de dados se o Ticket ID foi salvo

---

## 📚 Exemplos Práticos de Uso

### **Exemplo 1: Na tela de "Incluir Tarefa"**

```javascript
// Quando o usuário clicar no botão "Incluir" no SALAJuris
$('#btnIncluirTarefa').on('click', function() {
    var cpf = $('#inputCPF').val();
    var ddd = $('#inputDDD').val();
    var telefone = $('#inputTelefone').val();
    
    // Criar ticket BTG
    btgClient.criarTicket({
        document: cpf,
        phoneAreaCode: ddd,
        phoneNumber: telefone,
        channel: 'PHONE',
        type: 'OUTBOUND'
    }).then(function(result) {
        // Mostrar o Ticket ID na tela
        $('#ticketBTGId').text(result.ticketId);
        
        // Salvar no banco de dados do SALAJuris
        salvarTicket(cpf, result.ticketId);
    });
});
```

### **Exemplo 2: Na tela de "Mailing/Distribuição"**

```javascript
// Criar múltiplos tickets em lote
function criarTicketsEmLote(listaClientes) {
    var attempts = listaClientes.map(function(cliente) {
        return {
            document: cliente.cpf,
            phoneAreaCode: cliente.ddd,
            phoneNumber: cliente.telefone,
            channel: 'PHONE',
            type: 'OUTBOUND'
        };
    });
    
    btgClient.criarBatchAttempts(attempts).then(function(result) {
        alert(listaClientes.length + ' tickets criados com sucesso!');
    });
}
```

### **Exemplo 3: Na tela de "Dashboard"**

```javascript
// Mostrar estatísticas de tickets BTG
function carregarEstatisticasBTG() {
    $.ajax({
        url: '/api/tickets-btg/estatisticas',
        success: function(data) {
            $('#totalTicketsBTG').text(data.total);
            $('#ticketsAtivos').text(data.ativos);
            $('#ticketsEncerrados').text(data.encerrados);
        }
    });
}
```

---

## ✅ Checklist de Integração

- [ ] Arquivos CSS e JS copiados para o SALAJuris
- [ ] Referências adicionadas no HTML principal
- [ ] Cliente BTG inicializado no JavaScript
- [ ] Botões adicionados nas telas necessárias
- [ ] Tabela criada no banco de dados (opcional)
- [ ] Testes realizados com sucesso
- [ ] URL da API configurada para produção
- [ ] Integração funcionando em todas as telas

---

## 🆘 Problemas Comuns

### Erro: "btgClient is not defined"

**Solução:** Certifique-se de que o `btg-tickets-client.js` foi carregado antes de usar.

### Erro: "Failed to fetch"

**Solução:** Verifique se a API BTG está rodando em `http://localhost:5000`

### Modal não abre

**Solução:** Verifique se o CSS `btg-tickets.css` foi carregado corretamente

---

## 📞 Suporte

**Desenvolvedor:** Murilo Molina  
**E-mail:** murilo.molina@gmail.com

---

**Última atualização:** Outubro 2025
