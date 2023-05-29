namespace api.Models.DTOs;

public class ContactRequestDto
{
	public int Id { get; set; }

	public string Firstname { get; set; }

	public string Lastname { get; set; }

    public ICollection<ContactCustomFieldDto> CustomFields { get; set; }
}
