using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialSpaceTelegramAPI.Migrations
{
    /// <inheritdoc />
    public partial class SocialSpaceTelegramAPI7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TextPhotos",
                table: "MessageInfo");

            migrationBuilder.DropColumn(
                name: "UserPhoto",
                table: "MessageInfo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TextPhotos",
                table: "MessageInfo",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserPhoto",
                table: "MessageInfo",
                type: "text",
                nullable: true);
        }
    }
}
