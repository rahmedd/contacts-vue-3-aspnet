namespace api.Models.DTOs;

public class ContactDto
{
	public int Id { get; set; }

	public string Firstname { get; set; }

	public string Lastname { get; set; }

    public List<UserDto> Users { get; set; }

    public ICollection<ContactCustomFieldDto> CustomFields { get; set; }
}
