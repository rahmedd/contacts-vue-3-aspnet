using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class contactcustomfield : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactCustomField_Contacts_ContactId",
                table: "ContactCustomField");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContactCustomField",
                table: "ContactCustomField");

            migrationBuilder.RenameTable(
                name: "ContactCustomField",
                newName: "ContactCustomFields");

            migrationBuilder.RenameIndex(
                name: "IX_ContactCustomField_ContactId",
                table: "ContactCustomFields",
                newName: "IX_ContactCustomFields_ContactId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContactCustomFields",
                table: "ContactCustomFields",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactCustomFields_Contacts_ContactId",
                table: "ContactCustomFields",
                column: "ContactId",
                principalTable: "Contacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContactCustomFields_Contacts_ContactId",
                table: "ContactCustomFields");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ContactCustomFields",
                table: "ContactCustomFields");

            migrationBuilder.RenameTable(
                name: "ContactCustomFields",
                newName: "ContactCustomField");

            migrationBuilder.RenameIndex(
                name: "IX_ContactCustomFields_ContactId",
                table: "ContactCustomField",
                newName: "IX_ContactCustomField_ContactId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ContactCustomField",
                table: "ContactCustomField",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ContactCustomField_Contacts_ContactId",
                table: "ContactCustomField",
                column: "ContactId",
                principalTable: "Contacts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
