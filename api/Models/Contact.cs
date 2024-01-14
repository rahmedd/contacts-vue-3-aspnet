
namespace api.Models;

public class Contact
{
	public int Id { get; set; }
	
	public string Firstname { get; set; }

	public string Lastname { get; set; }

	public List<User> Users { get; set; } = new();

	public ICollection<ContactCustomField> CustomFields { get; set; } = new List<ContactCustomField>();
}