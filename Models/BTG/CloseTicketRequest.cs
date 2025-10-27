namespace BTGTicketsAPI.Models.BTG;

public class CloseTicketRequest
{
    public string AccessToken { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public string TicketId { get; set; } = string.Empty;
    public string? additionalInfo { get; set; }
    public string? partyName { get; set; }
    public string? partyTaxId { get; set; }
    public string? maturityDate { get; set; }
    public decimal? amount { get; set; }
    public string? counterPartyAssessorPosition { get; set; }
    public string? counterPartyAssessorName { get; set; }
    public string? contactPhoneAreaCode { get; set; }
    public string? contactPhoneNumber { get; set; }
    public string? email { get; set; }
    public string? scheduledDate { get; set; }
}
