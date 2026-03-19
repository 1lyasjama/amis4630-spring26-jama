using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BuckeyeMarketplaceApi.Migrations
{
    /// <inheritdoc />
    public partial class AddShoppingCart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Carts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Carts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    SellerName = table.Column<string>(type: "TEXT", nullable: false),
                    PostedDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CartItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CartId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CartItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CartItems_Carts_CartId",
                        column: x => x.CartId,
                        principalTable: "Carts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CartItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Description", "ImageUrl", "PostedDate", "Price", "SellerName", "Title" },
                values: new object[,]
                {
                    { 1, "Textbooks", "8th edition, lightly used. Some highlighting in chapters 1-5. Great condition overall.", "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop", new DateTime(2026, 2, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 45.00m, "Marcus J.", "Intro to Calculus Textbook" },
                    { 2, "Electronics", "Works perfectly, includes charging cable. Used for two semesters of math courses.", "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop", new DateTime(2026, 2, 14, 0, 0, 0, 0, DateTimeKind.Unspecified), 75.00m, "Aisha R.", "TI-84 Plus CE Graphing Calculator" },
                    { 3, "Furniture", "Adjustable LED desk lamp, white. Barely used, moving out of dorm.", "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop", new DateTime(2026, 2, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 15.00m, "Jake T.", "IKEA Desk Lamp" },
                    { 4, "Clothing", "Official OSU merch, scarlet red, size Large. Worn a handful of times.", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop", new DateTime(2026, 2, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 25.00m, "Taylor M.", "OSU Crewneck Sweatshirt (Large)" },
                    { 5, "Textbooks", "6th edition. No writing or highlighting inside. Includes access code (unused).", "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop", new DateTime(2026, 2, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 55.00m, "Priya K.", "Introduction to Psychology Textbook" },
                    { 6, "Electronics", "Selling because I switched to over-ear headphones. Comes with original case and tips.", "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=300&fit=crop", new DateTime(2026, 2, 25, 0, 0, 0, 0, DateTimeKind.Unspecified), 120.00m, "Marcus J.", "Apple AirPods Pro (2nd Gen)" },
                    { 7, "Furniture", "3.2 cu ft compact fridge, black. Perfect for dorm rooms. Pick up only.", "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop", new DateTime(2026, 2, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 60.00m, "Chris L.", "Mini Fridge (Dorm Size)" },
                    { 8, "Clothing", "Nike Pegasus 40, barely worn. Bought wrong size online, only used twice.", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop", new DateTime(2026, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 65.00m, "Aisha R.", "Nike Running Shoes (Size 10)" },
                    { 9, "Textbooks", "Covers all major topics in organic chemistry. All pages intact, used for one semester.", "https://images.unsplash.com/photo-1532634993-15f421e42ec0?w=400&h=300&fit=crop", new DateTime(2026, 3, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 20.00m, "Jake T.", "Intro to Organic Chemistry Textbook" },
                    { 10, "Electronics", "Logitech M720 Triathlon. Multi-device Bluetooth mouse, great for studying.", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop", new DateTime(2026, 3, 3, 0, 0, 0, 0, DateTimeKind.Unspecified), 30.00m, "Taylor M.", "Logitech Wireless Mouse" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_CartId",
                table: "CartItems",
                column: "CartId");

            migrationBuilder.CreateIndex(
                name: "IX_CartItems_ProductId",
                table: "CartItems",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CartItems");

            migrationBuilder.DropTable(
                name: "Carts");

            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
