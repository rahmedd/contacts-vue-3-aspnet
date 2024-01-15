using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.Models;

[Index(nameof(Username), IsUnique = true)]
public class User
{
	public int Id { get; set; }

	[Required]
	public string Username { get; set; }

	[Required]
	[JsonIgnore]
	public string Password { get; set; }

	public DateTime CreatedAt { get; set; }

	public DateTime UpdateAt { get; set; }

	public List<Contact> Contacts { get; set; } = new();

	public List<UserContact> UserContacts { get; set; } = new();
}
