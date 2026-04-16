using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BuckeyeMarketplaceApi.Models;

namespace BuckeyeMarketplaceApi.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Title = "Intro to Calculus Textbook", Description = "8th edition, lightly used. Some highlighting in chapters 1-5. Great condition overall.", Price = 45.00m, Category = "Textbooks", SellerName = "Marcus J.", PostedDate = new DateTime(2026, 2, 10), ImageUrl = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop" },
            new Product { Id = 2, Title = "TI-84 Plus CE Graphing Calculator", Description = "Works perfectly, includes charging cable. Used for two semesters of math courses.", Price = 75.00m, Category = "Electronics", SellerName = "Aisha R.", PostedDate = new DateTime(2026, 2, 14), ImageUrl = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop" },
            new Product { Id = 3, Title = "IKEA Desk Lamp", Description = "Adjustable LED desk lamp, white. Barely used, moving out of dorm.", Price = 15.00m, Category = "Furniture", SellerName = "Jake T.", PostedDate = new DateTime(2026, 2, 18), ImageUrl = "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop" },
            new Product { Id = 4, Title = "OSU Crewneck Sweatshirt (Large)", Description = "Official OSU merch, scarlet red, size Large. Worn a handful of times.", Price = 25.00m, Category = "Clothing", SellerName = "Taylor M.", PostedDate = new DateTime(2026, 2, 20), ImageUrl = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop" },
            new Product { Id = 5, Title = "Introduction to Psychology Textbook", Description = "6th edition. No writing or highlighting inside. Includes access code (unused).", Price = 55.00m, Category = "Textbooks", SellerName = "Priya K.", PostedDate = new DateTime(2026, 2, 22), ImageUrl = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop" },
            new Product { Id = 6, Title = "Apple AirPods Pro (2nd Gen)", Description = "Selling because I switched to over-ear headphones. Comes with original case and tips.", Price = 120.00m, Category = "Electronics", SellerName = "Marcus J.", PostedDate = new DateTime(2026, 2, 25), ImageUrl = "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop" },
            new Product { Id = 7, Title = "Mini Fridge (Dorm Size)", Description = "3.2 cu ft compact fridge, black. Perfect for dorm rooms. Pick up only.", Price = 60.00m, Category = "Furniture", SellerName = "Chris L.", PostedDate = new DateTime(2026, 2, 28), ImageUrl = "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop" },
            new Product { Id = 8, Title = "Nike Running Shoes (Size 10)", Description = "Nike Pegasus 40, barely worn. Bought wrong size online, only used twice.", Price = 65.00m, Category = "Clothing", SellerName = "Aisha R.", PostedDate = new DateTime(2026, 3, 1), ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop" },
            new Product { Id = 9, Title = "Intro to Organic Chemistry Textbook", Description = "Covers all major topics in organic chemistry. All pages intact, used for one semester.", Price = 20.00m, Category = "Textbooks", SellerName = "Jake T.", PostedDate = new DateTime(2026, 3, 2), ImageUrl = "https://images.unsplash.com/photo-1532634993-15f421e42ec0?w=400&h=300&fit=crop" },
            new Product { Id = 10, Title = "Logitech Wireless Mouse", Description = "Logitech M720 Triathlon. Multi-device Bluetooth mouse, great for studying.", Price = 30.00m, Category = "Electronics", SellerName = "Taylor M.", PostedDate = new DateTime(2026, 3, 3), ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop" }
        );

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasIndex(rt => rt.Token).IsUnique();
            entity.HasIndex(rt => rt.UserId);
            entity.Property(rt => rt.Token).HasMaxLength(200).IsRequired();
            entity.Property(rt => rt.UserId).HasMaxLength(450).IsRequired();
        });

        modelBuilder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = "role-admin", Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "concurrency-admin" },
            new IdentityRole { Id = "role-user", Name = "User", NormalizedName = "USER", ConcurrencyStamp = "concurrency-user" }
        );
    }
}
