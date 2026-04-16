using System.ComponentModel.DataAnnotations;

namespace BuckeyeMarketplaceApi.Dtos;

public class CreateOrderRequest
{
    [Required]
    [MinLength(5)]
    public string ShippingAddress { get; set; } = string.Empty;
}
