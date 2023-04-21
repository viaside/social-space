using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class SocialSpaceBackend5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string[]>(
                name: "Group",
                table: "UsersInfo",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "role",
                table: "UsersInfo",
                type: "text[]",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GroupInfo",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Members = table.Column<string[]>(type: "text[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupInfo", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupInfo");

            migrationBuilder.DropColumn(
                name: "Group",
                table: "UsersInfo");

            migrationBuilder.DropColumn(
                name: "role",
                table: "UsersInfo");
        }
    }
}
