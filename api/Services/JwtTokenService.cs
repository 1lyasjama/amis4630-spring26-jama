using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BuckeyeMarketplaceApi.Data;
using BuckeyeMarketplaceApi.Models;
using Microsoft.IdentityModel.Tokens;

namespace BuckeyeMarketplaceApi.Services;

public interface IJwtTokenService
{
    (string token, DateTime expiresAt) CreateToken(ApplicationUser user, IEnumerable<string> roles);
    Task<(string token, DateTime expiresAt)> IssueRefreshTokenAsync(ApplicationUser user);
    Task<RefreshToken?> RotateRefreshTokenAsync(string presentedToken);
}

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _db;
    private static readonly TimeSpan RefreshTokenLifetime = TimeSpan.FromDays(14);

    public JwtTokenService(IConfiguration config, AppDbContext db)
    {
        _config = config;
        _db = db;
    }

    public (string token, DateTime expiresAt) CreateToken(ApplicationUser user, IEnumerable<string> roles)
    {
        var key = _config["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key not configured. Set it via dotnet user-secrets.");
        var issuer = _config["Jwt:Issuer"] ?? "BuckeyeMarketplace";
        var audience = _config["Jwt:Audience"] ?? "BuckeyeMarketplaceUsers";

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
        {
            KeyId = "buckeye-signing-key-v1"
        };
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(8);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
        return (tokenString, expires);
    }

    public async Task<(string token, DateTime expiresAt)> IssueRefreshTokenAsync(ApplicationUser user)
    {
        var raw = GenerateSecureToken();
        var entity = new RefreshToken
        {
            Token = raw,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.Add(RefreshTokenLifetime)
        };
        _db.RefreshTokens.Add(entity);
        await _db.SaveChangesAsync();
        return (raw, entity.ExpiresAt);
    }

    public async Task<RefreshToken?> RotateRefreshTokenAsync(string presentedToken)
    {
        if (string.IsNullOrWhiteSpace(presentedToken)) return null;

        var existing = _db.RefreshTokens.FirstOrDefault(rt => rt.Token == presentedToken);
        if (existing == null || !existing.IsActive) return null;

        var replacement = new RefreshToken
        {
            Token = GenerateSecureToken(),
            UserId = existing.UserId,
            ExpiresAt = DateTime.UtcNow.Add(RefreshTokenLifetime)
        };
        existing.RevokedAt = DateTime.UtcNow;
        existing.ReplacedByToken = replacement.Token;
        _db.RefreshTokens.Add(replacement);
        await _db.SaveChangesAsync();
        return replacement;
    }

    private static string GenerateSecureToken()
    {
        var bytes = RandomNumberGenerator.GetBytes(64);
        return Convert.ToBase64String(bytes)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }
}
