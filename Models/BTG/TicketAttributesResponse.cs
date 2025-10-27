namespace BTGTicketsAPI.Models.BTG;

public class TicketAttributesResponse
{
    public List<string> ticketChannels { get; set; } = new();
    public List<string> ticketTypes { get; set; } = new();
    public List<TerminationCode> terminationCodes { get; set; } = new();
}

public class TerminationCode
{
    public string code { get; set; } = string.Empty;
    public string description { get; set; } = string.Empty;
}
