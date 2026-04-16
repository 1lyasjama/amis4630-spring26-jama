using Microsoft.AspNetCore.Identity;

namespace BuckeyeMarketplaceApi.Models;

public class ApplicationUser : IdentityUser
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
