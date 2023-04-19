using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SocialSpaceBackend3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MessageInfo_MessageId",
                table: "MessageInfo");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "MessageInfo",
                type: "integer",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "MessageInfo");

            migrationBuilder.CreateIndex(
                name: "IX_MessageInfo_MessageId",
                table: "MessageInfo",
                column: "MessageId",
                unique: true);
        }
    }
}
