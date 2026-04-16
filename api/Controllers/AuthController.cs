using BuckeyeMarketplaceApi.Dtos;
using BuckeyeMarketplaceApi.Models;
using BuckeyeMarketplaceApi.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BuckeyeMarketplaceApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtTokenService _tokenService;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtTokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        if (!PasswordRules.IsValid(request.Password))
        {
            return BadRequest(new
            {
                message = "Password must be at least 8 characters and include at least one digit and one uppercase letter."
            });
        }

        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing != null)
        {
            return Conflict(new { message = "Email is already registered." });
        }

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new { message = string.Join("; ", result.Errors.Select(e => e.Description)) });
        }

        await _userManager.AddToRoleAsync(user, "User");

        return Ok(await BuildAuthResponseAsync(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var passwordOk = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordOk)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(await BuildAuthResponseAsync(user));
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> Refresh(RefreshTokenRequest request)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var rotated = await _tokenService.RotateRefreshTokenAsync(request.RefreshToken);
        if (rotated == null)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token." });
        }

        var user = await _userManager.FindByIdAsync(rotated.UserId);
        if (user == null)
        {
            return Unauthorized(new { message = "User no longer exists." });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var (accessToken, expiresAt) = _tokenService.CreateToken(user, roles);

        return Ok(new AuthResponse
        {
            Token = accessToken,
            Email = user.Email!,
            UserId = user.Id,
            Roles = roles.ToList(),
            ExpiresAt = expiresAt,
            RefreshToken = rotated.Token,
            RefreshTokenExpiresAt = rotated.ExpiresAt
        });
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);
        var (accessToken, expiresAt) = _tokenService.CreateToken(user, roles);
        var (refreshToken, refreshExpiresAt) = await _tokenService.IssueRefreshTokenAsync(user);

        return new AuthResponse
        {
            Token = accessToken,
            Email = user.Email!,
            UserId = user.Id,
            Roles = roles.ToList(),
            ExpiresAt = expiresAt,
            RefreshToken = refreshToken,
            RefreshTokenExpiresAt = refreshExpiresAt
        };
    }
}
