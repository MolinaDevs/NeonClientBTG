using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using BTGTicketsAPI.Models.BTG;

namespace BTGTicketsAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class BTGTicketsController : ControllerBase
{
    private readonly HttpClient _client;
    private readonly ILogger<BTGTicketsController> _logger;
    private readonly IConfiguration _configuration;
    private readonly string _urlBase;
    private readonly string _authUrl;

    public BTGTicketsController(ILogger<BTGTicketsController> logger, IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
        _client = httpClientFactory.CreateClient();
        _client.Timeout = TimeSpan.FromMinutes(5);
        
        // Carregar URLs da configuração baseado no ambiente
        _authUrl = _configuration["BTG:AuthUrl"] ?? "https://btg-agreement.auth.sa-east-1.amazoncognito.com";
        
        string environment = _configuration["BTG:Environment"] ?? "UAT";
        _urlBase = environment.ToUpper() == "PRD" 
            ? _configuration["BTG:ApiUrlPRD"] ?? "https://api-everest-prd.btgpactual.com"
            : _configuration["BTG:ApiUrlUAT"] ?? "https://api-everest-uat.btgpactual.com";
    }

    #region Autenticação

    [HttpPost("autenticacao")]
    public async Task<IActionResult> Autenticacao()
    {
        try
        {
            var urlBuilder = new StringBuilder();
            urlBuilder.Append(_authUrl.TrimEnd('/')).Append("/oauth2/token");

            string appId = _configuration["BTG:AppId"] ?? "SEU_APP_ID";
            string secret = _configuration["BTG:Secret"] ?? "SEU_SECRET";
            string credentials = $"{appId}:{secret}";
            string base64Credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes(credentials));

            using var request = new HttpRequestMessage(HttpMethod.Post, $"{urlBuilder}?grant_type=client_credentials");
            request.Headers.Add("Authorization", $"Basic {base64Credentials}");
            request.Content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "client_credentials")
            });

            var response = await _client.SendAsync(request);
            var responseData = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Authentication failed: {StatusCode} - {Response}", response.StatusCode, responseData);
                return StatusCode((int)response.StatusCode, new { error = "Authentication failed", statusCode = response.StatusCode, response = responseData });
            }

            var result = JsonSerializer.Deserialize<Token>(responseData);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao autenticar");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    #endregion

    #region Atributos dos Tickets

    [HttpGet("tickets/attributes")]
    public async Task<IActionResult> BuscarAtributos([FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            var url = $"{_urlBase.TrimEnd('/')}/v2/btg-tickets/attempt-tickets/attributes";

            using var httpRequest = new HttpRequestMessage(HttpMethod.Get, url);
            httpRequest.Headers.Add("Authorization", authorization);
            httpRequest.Headers.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _client.SendAsync(httpRequest);
            var responseData = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to fetch attributes: {StatusCode} - {Response}", response.StatusCode, responseData);
                return StatusCode((int)response.StatusCode, new { error = "Failed to fetch attributes", statusCode = response.StatusCode, response = responseData });
            }

            var result = JsonSerializer.Deserialize<TicketAttributesResponse>(responseData);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar atributos");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    #endregion

    #region Criar Ticket

    [HttpPost("tickets/create")]
    public async Task<IActionResult> CriarTicket([FromBody] CreateTicketRequest param)
    {
        try
        {
            // CORREÇÃO: Usar o endpoint correto para criar tickets (não attempt-tickets)
            var url = $"{_urlBase.TrimEnd('/')}/v2/btg-tickets/customers/{param.Document}/tickets";

            var body = new
            {
                phoneAreaCode = param.phoneAreaCode,
                phoneNumber = param.phoneNumber,
                channel = param.channel,
                type = param.type
            };

            string createdBy = _configuration["BTG:CreatedBy"] ?? "OPERADOR_SISTEMA";

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, url);
            httpRequest.Headers.Add("Authorization", $"Bearer {param.AccessToken}");
            httpRequest.Headers.Add("createdBy", createdBy);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(httpRequest);
            var responseData = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to create ticket: {StatusCode} - {Response}", response.StatusCode, responseData);
                return StatusCode((int)response.StatusCode, new { error = "Failed to create ticket", statusCode = response.StatusCode, response = responseData });
            }

            var result = JsonSerializer.Deserialize<object>(responseData);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar ticket");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    #endregion

    #region Registrar Contrato no Ticket

    [HttpPost("tickets/contract/add")]
    public async Task<IActionResult> AdicionarContrato([FromBody] ContractRequest param)
    {
        try
        {
            var url = $"{_urlBase.TrimEnd('/')}/v2/btg-tickets/customers/{param.Document}/attempt-tickets/{param.TicketId}/contracts";

            var body = new
            {
                terminationCode = param.terminationCode,
                contractNumber = param.contractNumber,
                product = param.product,
                dueDays = param.dueDays
            };

            string createdBy = _configuration["BTG:CreatedBy"] ?? "OPERADOR_SISTEMA";

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, url);
            httpRequest.Headers.Add("Authorization", $"Bearer {param.AccessToken}");
            httpRequest.Headers.Add("createdBy", createdBy);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(httpRequest);
            var responseData = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to add contract: {StatusCode} - {Response}", response.StatusCode, responseData);
                return StatusCode((int)response.StatusCode, new { error = "Failed to add contract", statusCode = response.StatusCode, response = responseData });
            }

            var result = JsonSerializer.Deserialize<object>(responseData);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao adicionar contrato");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    #endregion

    #region Encerrar Ticket

    [HttpPost("tickets/close")]
    public async Task<IActionResult> EncerrarTicket([FromBody] CloseTicketRequest param)
    {
        try
        {
            // CORREÇÃO: Enviar dados no body JSON, não query string
            var url = $"{_urlBase.TrimEnd('/')}/v2/btg-tickets/customers/{param.Document}/attempt-tickets/{param.TicketId}/close";

            // Criar body com todos os campos opcionais
            var bodyDict = new Dictionary<string, object?>();
            if (!string.IsNullOrEmpty(param.additionalInfo)) bodyDict["additionalInfo"] = param.additionalInfo;
            if (!string.IsNullOrEmpty(param.partyName)) bodyDict["partyName"] = param.partyName;
            if (!string.IsNullOrEmpty(param.partyTaxId)) bodyDict["partyTaxId"] = param.partyTaxId;
            if (!string.IsNullOrEmpty(param.maturityDate)) bodyDict["maturityDate"] = param.maturityDate;
            if (param.amount.HasValue) bodyDict["amount"] = param.amount.Value;
            if (!string.IsNullOrEmpty(param.counterPartyAssessorPosition)) bodyDict["counterPartyAssessorPosition"] = param.counterPartyAssessorPosition;
            if (!string.IsNullOrEmpty(param.counterPartyAssessorName)) bodyDict["counterPartyAssessorName"] = param.counterPartyAssessorName;
            if (!string.IsNullOrEmpty(param.contactPhoneAreaCode)) bodyDict["contactPhoneAreaCode"] = param.contactPhoneAreaCode;
            if (!string.IsNullOrEmpty(param.contactPhoneNumber)) bodyDict["contactPhoneNumber"] = param.contactPhoneNumber;
            if (!string.IsNullOrEmpty(param.email)) bodyDict["email"] = param.email;
            if (!string.IsNullOrEmpty(param.scheduledDate)) bodyDict["scheduledDate"] = param.scheduledDate;

            string createdBy = _configuration["BTG:CreatedBy"] ?? "OPERADOR_SISTEMA";

            using var httpRequest = new HttpRequestMessage(HttpMethod.Put, url);
            httpRequest.Headers.Add("Authorization", $"Bearer {param.AccessToken}");
            httpRequest.Headers.Add("createdBy", createdBy);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(bodyDict), Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(httpRequest);
            var responseData = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to close ticket: {StatusCode} - {Response}", response.StatusCode, responseData);
                return StatusCode((int)response.StatusCode, new { error = "Failed to close ticket", statusCode = response.StatusCode, response = responseData });
            }

            var result = JsonSerializer.Deserialize<object>(responseData);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao encerrar ticket");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    #endregion

    #region Criar Attempt Ticket (Tentativa Discador)

    [HttpPost("tickets/attempt/create")]
    public async Task<IActionResult> CriarAttemptTicket([FromBody] CreateAttemptTicketRequest param)
    {
        try
        {
            var url = $"{_urlBase.TrimEnd('/')}/v2/btg-tickets/customers/{param.Document}/attempt-tickets";

            var body = new
            {
                phoneAreaCode = param.phoneAreaCode,
                phoneNumber = param.phoneNumber,
                channel = param.channel,
                type = param.type,
                duration = param.duration,
                contracts = param.contracts,
                contactPhoneAreaCode = param.contactPhoneAreaCode,
                contactPhoneNumber = param.contactPhoneNumber,
                email = param.email,
                scheduledDate = param.scheduledDate
            };

            string createdBy = _configuration["BTG:CreatedBy"] ?? "OPERADOR_SISTEMA";

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, url);
            httpRequest.Headers.Add("Authorization", $"Bearer {param.AccessToken}");
            httpRequest.Headers.Add("createdBy", createdBy);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(httpRequest);
            var responseData = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to create attempt ticket: {StatusCode} - {Response}", response.StatusCode, responseData);
                return StatusCode((int)response.StatusCode, new { error = "Failed to create attempt ticket", statusCode = response.StatusCode, response = responseData });
            }

            var result = JsonSerializer.Deserialize<object>(responseData);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar attempt ticket");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    #endregion

    #region Criar Attempt Tickets em Lote

    [HttpPost("tickets/attempt/batch")]
    public async Task<IActionResult> CriarAttemptTicketsBatch([FromBody] CreateAttemptTicketBatchRequest param)
    {
        try
        {
            var url = $"{_urlBase.TrimEnd('/')}/v2/btg-tickets/customers/attempt-tickets/batch";

            var body = new
            {
                tickets = param.tickets
            };

            string createdBy = _configuration["BTG:CreatedBy"] ?? "OPERADOR_SISTEMA";

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, url);
            httpRequest.Headers.Add("Authorization", $"Bearer {param.AccessToken}");
            httpRequest.Headers.Add("createdBy", createdBy);
            httpRequest.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            var response = await _client.SendAsync(httpRequest);
            var responseData = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to create batch tickets: {StatusCode} - {Response}", response.StatusCode, responseData);
                return StatusCode((int)response.StatusCode, new { error = "Failed to create batch tickets", statusCode = response.StatusCode, response = responseData });
            }

            var result = JsonSerializer.Deserialize<object>(responseData);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar tickets em lote");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    #endregion
}
