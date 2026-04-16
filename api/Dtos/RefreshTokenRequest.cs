using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplaceApi.Dtos;

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
