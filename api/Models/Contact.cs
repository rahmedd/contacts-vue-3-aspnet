
namespace api.Models;

public class Contact
{
	public int Id { get; set; }
	
	public string Firstname { get; set; }

	public string Lastname { get; set; }

	public ICollection<ContactCustomField> CustomFields { get; set; } = new List<ContactCustomField>();

	public List<User> Users { get; set; } = new();

	public List<UserContact> UserContacts { get; set; } = new();
}