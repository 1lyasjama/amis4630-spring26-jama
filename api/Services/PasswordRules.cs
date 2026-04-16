namespace BuckeyeMarketplaceApi.Services;

public static class PasswordRules
{
    public const int MinimumLength = 8;

    public static bool IsValid(string password)
    {
        if (string.IsNullOrWhiteSpace(password)) return false;
        if (password.Length < MinimumLength) return false;
        if (!password.Any(char.IsDigit)) return false;
        if (!password.Any(char.IsUpper)) return false;
        return true;
    }
}
