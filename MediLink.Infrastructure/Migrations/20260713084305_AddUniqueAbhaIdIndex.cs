using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediLink.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueAbhaIdIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_AbhaId",
                table: "AspNetUsers",
                column: "AbhaId",
                unique: true,
                filter: "[AbhaId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_AbhaId",
                table: "AspNetUsers");
        }
    }
}
