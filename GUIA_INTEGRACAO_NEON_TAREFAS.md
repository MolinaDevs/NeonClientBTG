# 🔗 Guia: Integrar BTG Tickets com NEON (Criar Tarefas)

**Desenvolvedor:** Murilo Molina  
**Data:** Outubro 2025  
**Objetivo:** Adicionar criação de Ticket BTG no fluxo de Criar Tarefas do NEON

---

## 🎯 O QUE FOI CRIADO

Criei **2 soluções** para você escolher:

### **Opção 1: Interface Visual Completa** (Recomendada para teste)
📄 **Arquivo:** `integracao-neon-criar-tarefas.html`

- Interface completa com 4 passos
- Formulários visuais
- Validações
- Ideal para testar o fluxo completo

### **Opção 2: Código JavaScript para Integrar no NEON** (Produção)
📄 **Arquivo:** `js/integracao-neon.js`

- Código pronto para usar no NEON
- Funções reutilizáveis
- Fácil de adaptar

---

## 🚀 OPÇÃO 1: Testar Interface Visual

### **Passo 1: Acessar a Interface**

```
http://localhost:5000/integracao-neon-criar-tarefas.html
```

### **Passo 2: Seguir o Fluxo**

**📋 Tela 1 - Dados do Cliente:**
- Nome, CPF, Telefone
- (Geralmente já vem preenchido do NEON)

**📞 Tela 2 - Criar Ticket BTG:**
- Selecionar canal (Telefone, Email, etc.)
- Selecionar tipo (Entrada/Saída)
- Clicar em "Criar Ticket BTG"

**🎯 Tela 3 - Tipo de Atendimento:** ← **NOVO!**
- Selecionar tipo de atendimento realizado
- Código de encerramento (opcional)
- Observações
- Valor do acordo
- Data de retorno

**✅ Tela 4 - Criar Tarefa NEON:**
- Revisar todos os dados
- Clicar em "Salvar Tarefa no NEON"

### **O que você verá:**

1. ✅ Ticket BTG criado com sucesso
2. ✅ Operador escolhe o tipo de atendimento
3. ✅ Dados prontos para salvar no NEON
4. ✅ JSON completo com todos os dados

---

## 💻 OPÇÃO 2: Integrar no Código do NEON

### **Passo 1: Copiar Arquivos**

Copie estes 3 arquivos para o seu sistema NEON:

```
wwwroot/css/btg-tickets.css          → NEON/css/
wwwroot/js/btg-tickets-client.js     → NEON/js/
wwwroot/js/integracao-neon.js        → NEON/js/
```

### **Passo 2: Incluir no HTML do NEON**

No seu arquivo principal (index.html, master.page, etc):

```html
<!-- CSS -->
<link rel="stylesheet" href="/css/btg-tickets.css">

<!-- JavaScript -->
<script src="/js/btg-tickets-client.js"></script>
<script src="/js/integracao-neon.js"></script>
```

### **Passo 3: Inicializar ao Carregar**

No seu código JavaScript principal do NEON:

```javascript
// Quando a página carregar
$(document).ready(function() {
    // Inicializar integração BTG
    IntegracaoBTGNeon.inicializar();
});
```

### **Passo 4: Substituir a Função de Criar Tarefa**

**SEU CÓDIGO ATUAL (exemplo):**

```javascript
function incluirTarefa() {
    var cliente = {
        codigo: $('#codigoCliente').val(),
        nome: $('#nomeCliente').val(),
        cpf: $('#cpfCliente').val(),
        telefone: $('#telefoneCliente').val()
    };
    
    // Salvar no banco NEON
    $.ajax({
        url: '/api/tarefas/criar',
        data: cliente,
        success: function() {
            alert('Tarefa criada!');
        }
    });
}
```

**CÓDIGO NOVO (com BTG):**

```javascript
async function incluirTarefa() {
    try {
        // Obter dados do cliente
        var cliente = {
            codigo: $('#codigoCliente').val(),
            nome: $('#nomeCliente').val(),
            cpf: $('#cpfCliente').val(),
            telefone: $('#telefoneCliente').val(),
            ddd: $('#dddCliente').val()
        };
        
        // Criar tarefa com ticket BTG
        const resultado = await IntegracaoBTGNeon.criarTarefaComTicketBTG(cliente, {
            canal: 'PHONE',
            tipo: 'OUTBOUND'
        });
        
        // Resultado contém:
        // - resultado.ticketBTG.ticketId
        // - resultado.tipoAtendimento (selecionado pelo operador)
        // - resultado.tarefaNeon (dados para salvar)
        
        alert('✅ Tarefa criada!\nTicket BTG: ' + resultado.ticketBTG.ticketId);
        
        // Recarregar tela
        window.location.reload();
        
    } catch (error) {
        alert('❌ Erro: ' + error.message);
    }
}
```

---

## 🎯 O QUE ACONTECE QUANDO CHAMAR A FUNÇÃO

```
incluirTarefa()
    ↓
1. Cria Ticket BTG automaticamente
    ↓
2. MODAL aparece para operador selecionar:
   ✅ Tipo de Atendimento (Acordo, Promessa, etc.)
   ✅ Código de Encerramento (AE, GA, etc.)
   ✅ Observações
   ✅ Valor do Acordo
   ✅ Data de Retorno
    ↓
3. Salva tudo no banco NEON
    ↓
4. Retorna sucesso
```

---

## 📊 TIPOS DE ATENDIMENTO DISPONÍVEIS

O modal mostrará estas opções para o operador escolher:

| Código | Descrição |
|--------|-----------|
| `ACORDO` | Acordo Efetuado |
| `PROMESSA` | Promessa de Pagamento |
| `NEGOCIACAO` | Negociação em Andamento |
| `CONTESTACAO` | Contestação de Dívida |
| `INFORMACAO` | Solicitação de Informações |
| `RECLAMACAO` | Reclamação |
| `SEM_CONTATO` | Sem Contato |
| `NUMERO_ERRADO` | Número Errado |
| `NAO_ACEITA` | Não Aceita Negociação |
| `RETORNO_SOLICITADO` | Retorno Solicitado |

---

## 🔧 PERSONALIZAR PARA O SEU SISTEMA

### **1. Adaptar Campos do NEON**

No arquivo `integracao-neon.js`, localize a função `criarTarefaNeon`:

```javascript
async criarTarefaNeon(dadosCliente, ticketBTG, tipoAtendimento) {
    const tarefaData = {
        // ADAPTE ESTES CAMPOS PARA OS CAMPOS DO SEU BANCO NEON
        codigoCliente: dadosCliente.codigo,
        nomeCliente: dadosCliente.nome,
        cpfCliente: dadosCliente.cpf,
        
        // Dados do BTG
        ticketBTG: ticketBTG.ticketId,
        
        // Tipo de atendimento
        tipoAtendimento: tipoAtendimento.tipo,
        observacoes: tipoAtendimento.observacoes,
        valorAcordo: tipoAtendimento.valorAcordo
    };

    // SUBSTITUA PELA CHAMADA REAL AO NEON
    return await $.ajax({
        url: '/api/neon/tarefas/criar',  // ← SEU ENDPOINT
        method: 'POST',
        data: tarefaData
    });
}
```

### **2. Adicionar Novos Tipos de Atendimento**

No arquivo `integracao-neon.js`, função `criarModalTipoAtendimento`, adicione opções:

```html
<select id="modalTipoAtendimento" required>
    <option value="">Selecione...</option>
    <option value="ACORDO">Acordo Efetuado</option>
    <!-- ADICIONE MAIS OPÇÕES AQUI -->
    <option value="SEU_TIPO">Seu Tipo Personalizado</option>
</select>
```

---

## 📝 EXEMPLO PRÁTICO COMPLETO

```html
<!-- Botão no NEON -->
<button id="btnIncluirTarefa" class="btn btn-primary">
    Incluir Tarefa
</button>

<script>
// Quando clicar no botão
$('#btnIncluirTarefa').on('click', async function() {
    // Buscar dados do cliente da tela
    const cliente = {
        codigo: $('#txtCodigoCliente').val(),
        nome: $('#txtNomeCliente').val(),
        cpf: $('#txtCPF').val().replace(/\D/g, ''),
        ddd: $('#txtDDD').val(),
        telefone: $('#txtTelefone').val().replace(/\D/g, '')
    };

    try {
        // Chamar integração BTG+NEON
        const resultado = await IntegracaoBTGNeon.criarTarefaComTicketBTG(cliente);
        
        // Sucesso!
        Swal.fire({
            icon: 'success',
            title: 'Tarefa Criada!',
            text: 'Ticket BTG: ' + resultado.ticketBTG.ticketId
        });
        
        // Recarregar grid de tarefas
        atualizarGridTarefas();
        
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message
        });
    }
});
</script>
```

---

## ✅ CHECKLIST DE INTEGRAÇÃO

- [ ] Arquivos CSS e JS copiados para o NEON
- [ ] Referências adicionadas no HTML
- [ ] `IntegracaoBTGNeon.inicializar()` chamado ao carregar
- [ ] Função `incluirTarefa()` adaptada
- [ ] Função `criarTarefaNeon()` adaptada com campos do NEON
- [ ] Testado o fluxo completo
- [ ] Modal aparece corretamente
- [ ] Dados salvam no banco NEON
- [ ] Ticket ID BTG salvo junto com a tarefa

---

## 🧪 TESTAR AGORA

### **1. Teste Visual (Interface):**
```
http://localhost:5000/integracao-neon-criar-tarefas.html
```

### **2. Teste no NEON:**
- Copie os arquivos
- Adapte o código
- Clique em "Incluir Tarefa"
- Modal deve aparecer
- Selecione tipo de atendimento
- Confirme

---

## 📊 DADOS SALVOS NO NEON

Quando você chamar a função, estes dados estarão disponíveis:

```javascript
{
    // Cliente
    codigoCliente: "CLI-001",
    nomeCliente: "João Silva",
    cpfCliente: "12345678901",
    telefone: "11987654321",
    
    // Ticket BTG
    ticketBTG: "42k5135015",
    canalAtendimento: "PHONE",
    tipoLigacao: "OUTBOUND",
    
    // Atendimento
    tipoAtendimento: "ACORDO",
    descricaoTipoAtendimento: "Acordo Efetuado",
    observacoes: "Cliente aceitou parcelar em 3x",
    valorAcordo: "R$ 1.500,00",
    dataRetorno: "2025-11-15",
    
    // Metadados
    dataCriacao: "2025-10-28T20:00:00Z",
    usuarioCriacao: "Operador123",
    origem: "BTG_TICKETS_API"
}
```

---

## 🆘 PROBLEMAS COMUNS

### **Modal não aparece**

Verifique se incluiu o CSS:
```html
<link rel="stylesheet" href="/css/btg-tickets.css">
```

### **Erro "IntegracaoBTGNeon is not defined"**

Verifique se incluiu o JS:
```html
<script src="/js/integracao-neon.js"></script>
```

### **Dados não salvam no NEON**

Adapte a função `criarTarefaNeon()` com seu endpoint real:
```javascript
return await $.ajax({
    url: '/SEU_ENDPOINT_NEON',
    method: 'POST',
    data: tarefaData
});
```

---

## 📞 SUPORTE

**Desenvolvedor:** Murilo Molina  
**E-mail:** murilo.molina@gmail.com

---

**✅ PRONTO PARA USAR!**

Teste primeiro a interface visual, depois integre no código do NEON.
