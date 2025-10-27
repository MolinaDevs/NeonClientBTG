# BTG Tickets WS - API Intermediária

## Visão Geral
Projeto de API intermediária em C# ASP.NET Web API para integração com BTG Tickets V2. Adaptado da arquitetura existente do NeonController, mantendo os mesmos padrões e estrutura de código.

## Objetivo
Fornecer uma camada intermediária para gerenciar o fluxo de tickets de atendimento BTG, incluindo:
- Autenticação OAuth2
- Criação e gerenciamento de tickets
- Registro de contratos negociados
- Encerramento de atendimentos
- Tentativas de discador (attempt tickets)

## Arquitetura do Projeto

### Estrutura de Pastas
```
BTGTicketsWS/
├── Controllers/           # Lógica de negócio e endpoints
│   └── BTGTicketsController.cs
├── Models/BTG/           # DTOs e modelos de dados
│   ├── Token.cs
│   ├── CreateTicketRequest.cs
│   ├── ContractRequest.cs
│   ├── CloseTicketRequest.cs
│   ├── TicketAttributesResponse.cs
│   ├── CreateAttemptTicketRequest.cs
│   └── BasicRequest.cs
├── App_Start/            # Configurações de inicialização
│   └── WebApiConfig.cs
└── Properties/           # Metadados do assembly
    └── AssemblyInfo.cs
```

### Padrões de Código
- **Controllers**: Seguem o padrão do NeonController com métodos síncronos que chamam versões assíncronas
- **Models**: Classes POCO com propriedades públicas para serialização JSON
- **HTTP Client**: Reutilização de HttpClient com configuração de proxy opcional
- **Error Handling**: Try-catch em todos os endpoints com retorno de objetos de erro estruturados

## Endpoints Implementados

### 1. Autenticação
- **Rota**: `POST /btg/autenticacao`
- **Descrição**: Gera Bearer Token OAuth2 com duração de 1 hora
- **Headers**: Basic Authentication (App ID:Secret em base64)

### 2. Buscar Atributos
- **Rota**: `POST /btg/tickets/attributes`
- **Descrição**: Retorna canais, tipos e códigos de terminação disponíveis
- **Auth**: Bearer Token

### 3. Criar Ticket
- **Rota**: `POST /btg/tickets/create`
- **Descrição**: Cria ticket de atendimento básico
- **Auth**: Bearer Token
- **Headers**: createdBy (nome do operador)

### 4. Adicionar Contrato
- **Rota**: `POST /btg/tickets/contract/add`
- **Descrição**: Registra contrato negociado no ticket
- **Auth**: Bearer Token

### 5. Encerrar Ticket
- **Rota**: `POST /btg/tickets/close`
- **Descrição**: Fecha ticket de atendimento
- **Auth**: Bearer Token
- **Query Params**: Informações adicionais opcionais

### 6. Criar Attempt Ticket
- **Rota**: `POST /btg/tickets/attempt/create`
- **Descrição**: Registra tentativa de discador com contratos
- **Auth**: Bearer Token

### 7. Criar Attempt Tickets em Lote
- **Rota**: `POST /btg/tickets/attempt/batch`
- **Descrição**: Cria múltiplas tentativas em uma única requisição
- **Auth**: Bearer Token

## Configuração

### Credenciais BTG
Localização: `Controllers/BTGTicketsController.cs` → método `AutenticacaoAsync()`

```csharp
string credentials = "APP_ID:SECRET";
```

**IMPORTANTE**: Substituir com credenciais reais fornecidas pelo BTG.

### Ambientes Disponíveis
- **UAT (Homologação)**: `https://api-everest-uat.btgpactual.com`
- **Produção**: `https://api-everest-prd.btgpactual.com`

Configurado por padrão para UAT. Alterar `_UrlBase` no controller para produção.

### Proxy (Opcional)
Configurado mas desabilitado por padrão (`UseProxy = false`). Para habilitar:

```csharp
_handler = new HttpClientHandler
{
    Proxy = proxy,
    UseProxy = true
};
```

## Dependências

### NuGet Packages
- Microsoft.AspNet.WebApi (5.2.9)
- Microsoft.AspNet.WebApi.Cors (5.2.9)
- Newtonsoft.Json (13.0.3)

### Framework
- .NET Framework 4.7.2
- C# 7.3

## Estado do Projeto

### Concluído ✅
- Estrutura completa de Models BTG
- BTGTicketsController com todos os endpoints principais
- Configurações do projeto (Web.config, Global.asax, etc)
- Documentação (README.md, replit.md)
- Arquivos de projeto (.csproj, packages.config)

### Próximas Etapas
- [ ] Configurar ambiente .NET no Replit
- [ ] Instalar dependências NuGet
- [ ] Configurar workflow para rodar o projeto
- [ ] Testar endpoints com credenciais reais
- [ ] Implementar cache de token
- [ ] Adicionar logging

## Alterações Recentes
**2025-10-27**: Criação inicial do projeto
- Implementados todos os endpoints BTG Tickets V2
- Estrutura de Models completa
- Configuração base do projeto ASP.NET Web API
- Documentação e README

## Preferências do Usuário
- Seguir estrutura e padrões do NeonController existente
- Manter compatibilidade com arquitetura C# ASP.NET Web API
- Código limpo e bem documentado em português
- Tratamento de erros consistente

## Observações Técnicas

### Serialização JSON
Configurado com:
- CamelCase nas propriedades
- Ignorar valores null
- Remoção do formatter XML (apenas JSON)

### Segurança
- Bearer Token expira em 1 hora
- Credenciais nunca devem ser commitadas no código
- Usar variáveis de ambiente ou configurações seguras em produção

### Headers Customizados BTG
- `createdBy`: Nome do operador (obrigatório em alguns endpoints)
- `Authorization`: Bearer Token (obrigatório em todos exceto autenticação)
- `Content-Type`: application/json (obrigatório)

## Documentação de Referência
- **BTG Tickets V2 API**: `attached_assets/_ (1) (1)_1761602364051.pdf`
- **Insomnia Collection**: `attached_assets/Insomnia-Collection-Tickets-UAT 4 (1)_1761602363802`

## Arquitetura Baseada em
- **Neon Controller**: Estrutura original analisada do projeto Neon
- **Repositórios**:
  - IntermediarioWS (NeonController)
  - Hellcovery (Arquitetura BLL/DAL/DTO)
  - Salajuris (Frontend)
