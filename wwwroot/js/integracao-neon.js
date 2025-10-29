/**
 * INTEGRAÇÃO BTG + NEON - CRIAR TAREFAS
 * Desenvolvedor: Murilo Molina
 * 
 * Este arquivo contém funções para integrar o BTG Tickets 
 * com o fluxo de Criar Tarefas do sistema NEON
 */

// ========================================
// CONFIGURAÇÃO
// ========================================

const IntegracaoBTGNeon = {
    // Configurações
    config: {
        apiBaseUrl: 'http://localhost:5000',
        salvarAutomaticamente: true, // Salvar no NEON automaticamente após criar ticket
        mostrarModal: true // Mostrar modal para selecionar tipo de atendimento
    },

    // Cliente BTG
    btgClient: null,

    // Dados do atendimento atual
    atendimentoAtual: null,

    /**
     * Inicializar integração
     */
    async inicializar() {
        try {
            // Criar cliente BTG se ainda não existir
            if (!this.btgClient) {
                this.btgClient = new BTGTicketsClient({
                    apiBaseUrl: this.config.apiBaseUrl
                });
            }

            // Autenticar
            await this.btgClient.autenticar();
            console.log('✅ Integração BTG+NEON inicializada');
            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar integração:', error);
            return false;
        }
    },

    /**
     * FUNÇÃO PRINCIPAL: Criar Tarefa com Ticket BTG
     * 
     * Chame esta função no lugar do seu "incluirTarefa()" atual
     * 
     * @param {Object} dadosCliente - Dados do cliente
     * @param {Object} opcoes - Opções adicionais
     */
    async criarTarefaComTicketBTG(dadosCliente, opcoes = {}) {
        try {
            // 1. Criar ticket BTG
            const ticketBTG = await this.criarTicketBTG(dadosCliente, opcoes);

            // 2. Mostrar modal para selecionar tipo de atendimento
            if (this.config.mostrarModal) {
                const tipoAtendimento = await this.selecionarTipoAtendimento(ticketBTG);
                
                // 3. Criar tarefa no NEON
                const tarefaNeon = await this.criarTarefaNeon(dadosCliente, ticketBTG, tipoAtendimento);
                
                return {
                    sucesso: true,
                    ticketBTG: ticketBTG,
                    tipoAtendimento: tipoAtendimento,
                    tarefaNeon: tarefaNeon
                };
            } else {
                // Criar tarefa sem modal
                const tarefaNeon = await this.criarTarefaNeon(dadosCliente, ticketBTG, null);
                
                return {
                    sucesso: true,
                    ticketBTG: ticketBTG,
                    tarefaNeon: tarefaNeon
                };
            }
        } catch (error) {
            console.error('Erro ao criar tarefa com ticket BTG:', error);
            throw error;
        }
    },

    /**
     * Criar Ticket BTG
     */
    async criarTicketBTG(dadosCliente, opcoes) {
        const ticketData = {
            document: dadosCliente.cpf || dadosCliente.documento,
            phoneAreaCode: dadosCliente.ddd || this.extrairDDD(dadosCliente.telefone),
            phoneNumber: dadosCliente.telefone || dadosCliente.celular,
            channel: opcoes.canal || 'PHONE',
            type: opcoes.tipo || 'OUTBOUND'
        };

        const result = await this.btgClient.criarTicket(ticketData);
        
        return {
            ticketId: result.ticketId,
            canal: ticketData.channel,
            tipo: ticketData.type,
            dataCriacao: new Date()
        };
    },

    /**
     * Modal para selecionar tipo de atendimento
     * Retorna uma Promise que resolve quando o usuário selecionar
     */
    selecionarTipoAtendimento(ticketBTG) {
        return new Promise((resolve, reject) => {
            // Criar modal dinamicamente
            const modal = this.criarModalTipoAtendimento(ticketBTG);
            document.body.appendChild(modal);

            // Mostrar modal
            modal.style.display = 'block';

            // Handler do formulário
            const form = modal.querySelector('#formTipoAtendimentoModal');
            form.onsubmit = (e) => {
                e.preventDefault();
                
                const dados = {
                    tipo: document.getElementById('modalTipoAtendimento').value,
                    tipoTexto: document.getElementById('modalTipoAtendimento').selectedOptions[0].text,
                    codigoEncerramento: document.getElementById('modalCodigoEncerramento').value,
                    observacoes: document.getElementById('modalObservacoes').value,
                    valorAcordo: document.getElementById('modalValorAcordo').value,
                    dataRetorno: document.getElementById('modalDataRetorno').value
                };

                // Fechar modal
                document.body.removeChild(modal);

                resolve(dados);
            };

            // Botão cancelar
            modal.querySelector('.btn-cancelar').onclick = () => {
                document.body.removeChild(modal);
                reject(new Error('Usuário cancelou'));
            };
        });
    },

    /**
     * Criar HTML do modal
     */
    criarModalTipoAtendimento(ticketBTG) {
        const modalHTML = `
            <div class="btg-modal" style="display: none;">
                <div class="btg-modal-content">
                    <div class="btg-modal-header">
                        <h3>🎯 Tipo de Atendimento Realizado</h3>
                    </div>
                    <div class="btg-modal-body">
                        <div style="background: #d1fae5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                            <strong>✅ Ticket BTG Criado:</strong> ${ticketBTG.ticketId}
                        </div>

                        <form id="formTipoAtendimentoModal">
                            <div class="btg-form-group">
                                <label>Tipo de Atendimento *</label>
                                <select id="modalTipoAtendimento" required>
                                    <option value="">Selecione...</option>
                                    <option value="ACORDO">Acordo Efetuado</option>
                                    <option value="PROMESSA">Promessa de Pagamento</option>
                                    <option value="NEGOCIACAO">Negociação em Andamento</option>
                                    <option value="CONTESTACAO">Contestação de Dívida</option>
                                    <option value="INFORMACAO">Solicitação de Informações</option>
                                    <option value="RECLAMACAO">Reclamação</option>
                                    <option value="SEM_CONTATO">Sem Contato</option>
                                    <option value="NUMERO_ERRADO">Número Errado</option>
                                    <option value="NAO_ACEITA">Não Aceita Negociação</option>
                                    <option value="RETORNO_SOLICITADO">Retorno Solicitado</option>
                                </select>
                            </div>

                            <div class="btg-form-group">
                                <label>Código de Encerramento BTG</label>
                                <select id="modalCodigoEncerramento">
                                    <option value="">Não encerrar agora</option>
                                    <option value="AE">AE - Acordo Efetuado</option>
                                    <option value="GA">GA - Garantia</option>
                                    <option value="TT">TT - Título Transferido</option>
                                    <option value="GB">GB - Garantia Bloqueada</option>
                                    <option value="TW">TW - Título com WhatsApp</option>
                                </select>
                            </div>

                            <div class="btg-form-group">
                                <label>Observações</label>
                                <textarea id="modalObservacoes" rows="3"></textarea>
                            </div>

                            <div class="btg-form-row">
                                <div class="btg-form-group">
                                    <label>Valor do Acordo</label>
                                    <input type="text" id="modalValorAcordo" placeholder="R$ 0,00">
                                </div>
                                <div class="btg-form-group">
                                    <label>Data de Retorno</label>
                                    <input type="date" id="modalDataRetorno">
                                </div>
                            </div>

                            <div class="btg-modal-footer">
                                <button type="button" class="btg-btn btg-btn-secondary btn-cancelar">Cancelar</button>
                                <button type="submit" class="btg-btn btg-btn-success">Confirmar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = modalHTML;
        return div.firstElementChild;
    },

    /**
     * Criar Tarefa no NEON
     * 
     * ADAPTE ESTA FUNÇÃO PARA O SEU SISTEMA NEON
     */
    async criarTarefaNeon(dadosCliente, ticketBTG, tipoAtendimento) {
        const tarefaData = {
            // Campos do NEON (ADAPTE CONFORME SEU SISTEMA)
            codigoCliente: dadosCliente.codigo || dadosCliente.id,
            nomeCliente: dadosCliente.nome,
            cpfCliente: dadosCliente.cpf || dadosCliente.documento,
            telefone: dadosCliente.telefone,
            
            // Dados do BTG
            ticketBTG: ticketBTG.ticketId,
            canalAtendimento: ticketBTG.canal,
            tipoLigacao: ticketBTG.tipo,
            
            // Dados do atendimento
            tipoAtendimento: tipoAtendimento?.tipo || 'NAO_INFORMADO',
            descricaoTipoAtendimento: tipoAtendimento?.tipoTexto || '',
            observacoes: tipoAtendimento?.observacoes || '',
            valorAcordo: tipoAtendimento?.valorAcordo || '',
            dataRetorno: tipoAtendimento?.dataRetorno || '',
            
            // Metadados
            dataCriacao: new Date().toISOString(),
            usuarioCriacao: this.obterUsuarioLogado(),
            origem: 'BTG_TICKETS_API'
        };

        // SUBSTITUA ISTO PELA CHAMADA REAL AO SEU SISTEMA NEON
        // Exemplo com jQuery:
        /*
        return await $.ajax({
            url: '/api/neon/tarefas/criar',
            method: 'POST',
            data: tarefaData,
            dataType: 'json'
        });
        */

        // Por enquanto, só simular
        console.log('📝 Tarefa NEON (simulado):', tarefaData);
        
        return {
            id: 'TAREFA-' + Date.now(),
            ...tarefaData
        };
    },

    /**
     * Extrair DDD do telefone
     */
    extrairDDD(telefone) {
        if (!telefone) return '';
        const numeros = telefone.replace(/\D/g, '');
        return numeros.substring(0, 2);
    },

    /**
     * Obter usuário logado (adapte para seu sistema)
     */
    obterUsuarioLogado() {
        // ADAPTE ISTO PARA PEGAR O USUÁRIO DO SEU SISTEMA
        // Exemplos:
        // return window.usuarioLogado;
        // return $('#nomeUsuario').text();
        // return localStorage.getItem('usuario');
        
        return 'Operador NEON';
    }
};

// ========================================
// EXEMPLOS DE USO
// ========================================

/**
 * EXEMPLO 1: Substituir o "Incluir Tarefa" atual do NEON
 * 
 * NO SEU CÓDIGO ATUAL DO NEON, onde você tem algo como:
 * 
 * function incluirTarefa() {
 *     var cliente = obterDadosCliente();
 *     salvarTarefaNoBanco(cliente);
 * }
 * 
 * SUBSTITUA POR:
 */
async function incluirTarefaComBTG() {
    try {
        // Obter dados do cliente (do seu formulário NEON)
        const cliente = {
            codigo: $('#codigoCliente').val(),
            nome: $('#nomeCliente').val(),
            cpf: $('#cpfCliente').val(),
            telefone: $('#telefoneCliente').val(),
            ddd: $('#dddCliente').val()
        };

        // Inicializar se ainda não foi
        if (!IntegracaoBTGNeon.btgClient) {
            await IntegracaoBTGNeon.inicializar();
        }

        // Criar tarefa com ticket BTG
        const resultado = await IntegracaoBTGNeon.criarTarefaComTicketBTG(cliente, {
            canal: 'PHONE',
            tipo: 'OUTBOUND'
        });

        console.log('✅ Tarefa criada com sucesso!');
        console.log('Ticket BTG:', resultado.ticketBTG.ticketId);
        console.log('Tarefa NEON:', resultado.tarefaNeon.id);

        // Atualizar interface do NEON
        alert('✅ Tarefa criada com sucesso!\nTicket BTG: ' + resultado.ticketBTG.ticketId);
        
        // Recarregar lista de tarefas ou redirecionar
        // window.location.reload();
        
    } catch (error) {
        alert('Erro ao criar tarefa: ' + error.message);
    }
}

/**
 * EXEMPLO 2: Criar ticket BTG ao clicar em um botão
 */
function configurarBotaoBTG() {
    // Adicionar este código onde você inicializa os botões do NEON
    $('.btn-criar-tarefa').on('click', async function() {
        await incluirTarefaComBTG();
    });
}

/**
 * EXEMPLO 3: Criar ticket automaticamente quando abrir tela de cliente
 */
async function abrirTelaCliente(codigoCliente) {
    const cliente = await buscarClientePorCodigo(codigoCliente);
    
    // Criar ticket BTG automaticamente
    if (!IntegracaoBTGNeon.btgClient) {
        await IntegracaoBTGNeon.inicializar();
    }
    
    const ticket = await IntegracaoBTGNeon.criarTicketBTG(cliente, {
        canal: 'PHONE',
        tipo: 'OUTBOUND'
    });
    
    // Mostrar ticket ID na tela
    $('#ticketBTG').text(ticket.ticketId);
    
    // Continuar com sua lógica normal do NEON
    exibirDadosCliente(cliente);
}
