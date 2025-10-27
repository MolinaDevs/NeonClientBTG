namespace BTGTicketsAPI.Models.BTG;

public class CreateAttemptTicketRequest
{
    public string AccessToken { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public string phoneAreaCode { get; set; } = string.Empty;
    public string phoneNumber { get; set; } = string.Empty;
    public string channel { get; set; } = string.Empty;
    public string type { get; set; } = string.Empty;
    public int duration { get; set; }
    public List<AttemptContract> contracts { get; set; } = new();
    public string? contactPhoneAreaCode { get; set; }
    public string? contactPhoneNumber { get; set; }
    public string? email { get; set; }
    public string? scheduledDate { get; set; }
}

public class AttemptContract
{
    public string terminationCode { get; set; } = string.Empty;
    public string contractNumber { get; set; } = string.Empty;
    public string product { get; set; } = string.Empty;
    public int? dueDays { get; set; }
}

public class CreateAttemptTicketBatchRequest
{
    public string AccessToken { get; set; } = string.Empty;
    public List<AttemptTicketBatch> tickets { get; set; } = new();
}

public class AttemptTicketBatch
{
    public string phoneAreaCode { get; set; } = string.Empty;
    public string phoneNumber { get; set; } = string.Empty;
    public string documentNumber { get; set; } = string.Empty;
    public string channel { get; set; } = string.Empty;
    public string type { get; set; } = string.Empty;
    public int duration { get; set; }
    public List<AttemptContract> contracts { get; set; } = new();
    public string? contactPhoneAreaCode { get; set; }
    public string? contactPhoneNumber { get; set; }
    public string? email { get; set; }
    public string? scheduledDate { get; set; }
}
