using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialSpaceTelegramAPI.Migrations
{
    /// <inheritdoc />
    public partial class SocialSpaceTelegramAPI6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "TextPhoto",
                table: "MessageInfo",
                type: "bytea",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "UserAvatar",
                table: "MessageInfo",
                type: "bytea",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TextPhoto",
                table: "MessageInfo");

            migrationBuilder.DropColumn(
                name: "UserAvatar",
                table: "MessageInfo");
        }
    }
}
