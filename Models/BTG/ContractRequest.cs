namespace BTGTicketsAPI.Models.BTG;

public class ContractRequest
{
    public string AccessToken { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public string TicketId { get; set; } = string.Empty;
    public string terminationCode { get; set; } = string.Empty;
    public string contractNumber { get; set; } = string.Empty;
    public string product { get; set; } = string.Empty;
    public int? dueDays { get; set; }
}

public class Contract
{
    public string terminationCode { get; set; } = string.Empty;
    public string contractNumber { get; set; } = string.Empty;
    public string product { get; set; } = string.Empty;
    public int? dueDays { get; set; }
    public string id { get; set; } = string.Empty;
    public DateTime createdAt { get; set; }
    public TicketReference ticket { get; set; } = new();
}

public class TicketReference
{
    public string id { get; set; } = string.Empty;
}
