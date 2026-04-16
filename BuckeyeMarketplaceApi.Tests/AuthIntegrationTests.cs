using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using BuckeyeMarketplaceApi.Dtos;
using Xunit;

namespace BuckeyeMarketplaceApi.Tests;

public class AuthIntegrationTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);

    public AuthIntegrationTests(TestWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Cart_WithoutToken_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/cart");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task RegisterLoginAndFetchCart_Succeeds()
    {
        var client = _factory.CreateClient();
        var email = $"user-{Guid.NewGuid():N}@test.com";

        var register = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Valid123!"
        });
        register.EnsureSuccessStatusCode();
        var auth = await register.Content.ReadFromJsonAsync<AuthResponse>(JsonOpts);
        Assert.NotNull(auth);
        Assert.False(string.IsNullOrWhiteSpace(auth!.Token));
        Assert.Contains("User", auth.Roles);

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.Token);

        var cartResponse = await client.GetAsync("/api/cart");
        cartResponse.EnsureSuccessStatusCode();
        var cart = await cartResponse.Content.ReadFromJsonAsync<CartResponse>(JsonOpts);
        Assert.NotNull(cart);
        Assert.Empty(cart!.Items);
    }

    [Fact]
    public async Task NonAdmin_CannotAccessAdminOrdersList()
    {
        var client = _factory.CreateClient();
        var email = $"user-{Guid.NewGuid():N}@test.com";
        var register = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Valid123!"
        });
        register.EnsureSuccessStatusCode();
        var auth = await register.Content.ReadFromJsonAsync<AuthResponse>(JsonOpts);

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.Token);
        var response = await client.GetAsync("/api/orders");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Refresh_RotatesRefreshToken_AndReturnsNewAccessToken()
    {
        var client = _factory.CreateClient();
        var email = $"user-{Guid.NewGuid():N}@test.com";
        var register = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Valid123!"
        });
        register.EnsureSuccessStatusCode();
        var initial = await register.Content.ReadFromJsonAsync<AuthResponse>(JsonOpts);
        Assert.NotNull(initial);
        Assert.False(string.IsNullOrWhiteSpace(initial!.RefreshToken));

        var refreshResponse = await client.PostAsJsonAsync("/api/auth/refresh", new
        {
            refreshToken = initial.RefreshToken
        });
        refreshResponse.EnsureSuccessStatusCode();
        var rotated = await refreshResponse.Content.ReadFromJsonAsync<AuthResponse>(JsonOpts);
        Assert.NotNull(rotated);
        Assert.False(string.IsNullOrWhiteSpace(rotated!.Token));
        Assert.NotEqual(initial.RefreshToken, rotated.RefreshToken);

        var reuseResponse = await client.PostAsJsonAsync("/api/auth/refresh", new
        {
            refreshToken = initial.RefreshToken
        });
        Assert.Equal(HttpStatusCode.Unauthorized, reuseResponse.StatusCode);
    }

    [Fact]
    public async Task CheckoutFlow_CreatesOrder_AndClearsCart()
    {
        var client = _factory.CreateClient();
        var email = $"user-{Guid.NewGuid():N}@test.com";
        var register = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Valid123!"
        });
        var auth = await register.Content.ReadFromJsonAsync<AuthResponse>(JsonOpts);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.Token);

        var addResponse = await client.PostAsJsonAsync("/api/cart", new { productId = 1, quantity = 2 });
        addResponse.EnsureSuccessStatusCode();

        var orderResponse = await client.PostAsJsonAsync("/api/orders", new
        {
            shippingAddress = "123 Test Lane, Columbus OH"
        });
        Assert.Equal(HttpStatusCode.Created, orderResponse.StatusCode);
        var order = await orderResponse.Content.ReadFromJsonAsync<OrderResponse>(JsonOpts);
        Assert.NotNull(order);
        Assert.StartsWith("BM-", order!.ConfirmationNumber);
        Assert.Single(order.Items);

        var cartAfter = await client.GetFromJsonAsync<CartResponse>("/api/cart", JsonOpts);
        Assert.Empty(cartAfter!.Items);
    }
}
