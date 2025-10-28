/**
 * BTG Tickets Client - Módulo de Integração
 * Desenvolvedor: Murilo Molina
 * 
 * Este módulo pode ser facilmente integrado em qualquer sistema web existente
 * Compatível com jQuery e JavaScript puro
 */

class BTGTicketsClient {
    constructor(config) {
        this.apiBaseUrl = config.apiBaseUrl || 'http://localhost:5000';
        this.accessToken = null;
        this.tokenExpiry = null;
        this.onError = config.onError || this.defaultErrorHandler;
        this.onSuccess = config.onSuccess || this.defaultSuccessHandler;
    }

    /**
     * Obtém um token de acesso da API BTG
     */
    async autenticar() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/BTGTickets/autenticacao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha na autenticação');
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000);
            
            return data;
        } catch (error) {
            this.onError('Erro ao autenticar: ' + error.message);
            throw error;
        }
    }

    /**
     * Verifica se o token ainda é válido
     */
    isTokenValid() {
        if (!this.accessToken || !this.tokenExpiry) {
            return false;
        }
        return Date.now() < this.tokenExpiry;
    }

    /**
     * Garante que temos um token válido
     */
    async ensureAuthenticated() {
        if (!this.isTokenValid()) {
            await this.autenticar();
        }
    }

    /**
     * Busca atributos disponíveis (canais, tipos, códigos)
     */
    async buscarAtributos() {
        await this.ensureAuthenticated();

        try {
            const response = await fetch(`${this.apiBaseUrl}/BTGTickets/tickets/attributes`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar atributos');
            }

            return await response.json();
        } catch (error) {
            this.onError('Erro ao buscar atributos: ' + error.message);
            throw error;
        }
    }

    /**
     * Cria um novo ticket de atendimento
     */
    async criarTicket(ticketData) {
        await this.ensureAuthenticated();

        try {
            const payload = {
                AccessToken: this.accessToken,
                Document: ticketData.document,
                phoneAreaCode: ticketData.phoneAreaCode,
                phoneNumber: ticketData.phoneNumber,
                channel: ticketData.channel || 'PHONE',
                type: ticketData.type || 'OUTBOUND'
            };

            const response = await fetch(`${this.apiBaseUrl}/BTGTickets/tickets/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao criar ticket');
            }

            const result = await response.json();
            this.onSuccess('Ticket criado com sucesso! ID: ' + result.ticketId);
            return result;
        } catch (error) {
            this.onError('Erro ao criar ticket: ' + error.message);
            throw error;
        }
    }

    /**
     * Adiciona um contrato a um ticket
     */
    async adicionarContrato(contractData) {
        await this.ensureAuthenticated();

        try {
            const payload = {
                AccessToken: this.accessToken,
                Document: contractData.document,
                TicketId: contractData.ticketId,
                terminationCode: contractData.terminationCode,
                contractNumber: contractData.contractNumber,
                product: contractData.product,
                dueDays: contractData.dueDays
            };

            const response = await fetch(`${this.apiBaseUrl}/BTGTickets/tickets/contract/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao adicionar contrato');
            }

            const result = await response.json();
            this.onSuccess('Contrato adicionado com sucesso!');
            return result;
        } catch (error) {
            this.onError('Erro ao adicionar contrato: ' + error.message);
            throw error;
        }
    }

    /**
     * Encerra um ticket
     */
    async encerrarTicket(closeData) {
        await this.ensureAuthenticated();

        try {
            const payload = {
                AccessToken: this.accessToken,
                Document: closeData.document,
                TicketId: closeData.ticketId,
                additionalInfo: closeData.additionalInfo,
                partyName: closeData.partyName,
                partyTaxId: closeData.partyTaxId,
                email: closeData.email
            };

            const response = await fetch(`${this.apiBaseUrl}/BTGTickets/tickets/close`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao encerrar ticket');
            }

            const result = await response.json();
            this.onSuccess('Ticket encerrado com sucesso!');
            return result;
        } catch (error) {
            this.onError('Erro ao encerrar ticket: ' + error.message);
            throw error;
        }
    }

    /**
     * Cria uma tentativa de discador (attempt ticket)
     */
    async criarAttemptTicket(attemptData) {
        await this.ensureAuthenticated();

        try {
            const payload = {
                AccessToken: this.accessToken,
                Document: attemptData.document,
                phoneAreaCode: attemptData.phoneAreaCode,
                phoneNumber: attemptData.phoneNumber,
                channel: attemptData.channel || 'PHONE',
                type: attemptData.type || 'OUTBOUND'
            };

            const response = await fetch(`${this.apiBaseUrl}/BTGTickets/tickets/attempt/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao criar attempt ticket');
            }

            const result = await response.json();
            this.onSuccess('Attempt ticket criado com sucesso!');
            return result;
        } catch (error) {
            this.onError('Erro ao criar attempt ticket: ' + error.message);
            throw error;
        }
    }

    /**
     * Cria múltiplas tentativas em lote
     */
    async criarBatchAttempts(attempts) {
        await this.ensureAuthenticated();

        try {
            const payload = {
                AccessToken: this.accessToken,
                Attempts: attempts
            };

            const response = await fetch(`${this.apiBaseUrl}/BTGTickets/tickets/attempt/batch`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao criar batch attempts');
            }

            const result = await response.json();
            this.onSuccess(`${attempts.length} attempts criados com sucesso!`);
            return result;
        } catch (error) {
            this.onError('Erro ao criar batch attempts: ' + error.message);
            throw error;
        }
    }

    // Handlers padrão
    defaultErrorHandler(message) {
        console.error('BTG Tickets Error:', message);
        alert('Erro: ' + message);
    }

    defaultSuccessHandler(message) {
        console.log('BTG Tickets Success:', message);
        alert(message);
    }
}

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BTGTicketsClient;
}
