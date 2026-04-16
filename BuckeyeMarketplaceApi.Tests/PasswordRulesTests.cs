using BuckeyeMarketplaceApi.Services;
using Xunit;

namespace BuckeyeMarketplaceApi.Tests;

public class PasswordRulesTests
{
    [Theory]
    [InlineData("Abcd1234", true)]
    [InlineData("Admin123!", true)]
    [InlineData("short1A", false)]          // too short
    [InlineData("alllowercase1", false)]    // no uppercase
    [InlineData("NOLOWERCASE1", true)]      // uppercase + digit present, no lowercase required
    [InlineData("NoDigitsHere", false)]     // no digit
    [InlineData("", false)]
    [InlineData("   ", false)]
    public void IsValid_EnforcesRules(string password, bool expected)
    {
        Assert.Equal(expected, PasswordRules.IsValid(password));
    }
}
