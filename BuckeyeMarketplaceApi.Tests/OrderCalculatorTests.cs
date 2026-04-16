using BuckeyeMarketplaceApi.Models;
using BuckeyeMarketplaceApi.Services;
using Xunit;

namespace BuckeyeMarketplaceApi.Tests;

public class OrderCalculatorTests
{
    [Fact]
    public void CalculateTotal_SumsPriceTimesQuantity()
    {
        var items = new List<CartItem>
        {
            new() { Quantity = 2, Product = new Product { Price = 10m } },
            new() { Quantity = 3, Product = new Product { Price = 5m } }
        };

        var total = OrderCalculator.CalculateTotal(items);

        Assert.Equal(35m, total);
    }

    [Fact]
    public void CalculateTotal_EmptyCart_ReturnsZero()
    {
        var total = OrderCalculator.CalculateTotal(new List<CartItem>());
        Assert.Equal(0m, total);
    }

    [Fact]
    public void GenerateConfirmationNumber_StartsWithPrefix()
    {
        var number = OrderCalculator.GenerateConfirmationNumber();
        Assert.StartsWith("BM-", number);
        Assert.True(number.Length > 10);
    }

    [Fact]
    public void MapCartToOrderItems_CopiesPriceAndSnapshotName()
    {
        var items = new List<CartItem>
        {
            new()
            {
                ProductId = 7,
                Quantity = 2,
                Product = new Product { Id = 7, Title = "Widget", Price = 12.50m }
            }
        };

        var result = OrderCalculator.MapCartToOrderItems(items);

        var mapped = Assert.Single(result);
        Assert.Equal(7, mapped.ProductId);
        Assert.Equal("Widget", mapped.ProductName);
        Assert.Equal(12.50m, mapped.UnitPrice);
        Assert.Equal(2, mapped.Quantity);
        Assert.Equal(25.00m, mapped.LineTotal);
    }
}
