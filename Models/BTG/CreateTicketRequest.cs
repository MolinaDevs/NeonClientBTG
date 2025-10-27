namespace BTGTicketsAPI.Models.BTG;

public class CreateTicketRequest
{
    public string AccessToken { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public string phoneAreaCode { get; set; } = string.Empty;
    public string phoneNumber { get; set; } = string.Empty;
    public string channel { get; set; } = string.Empty;
    public string type { get; set; } = string.Empty;
}
