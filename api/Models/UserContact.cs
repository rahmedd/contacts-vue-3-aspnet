namespace api.Models;

public class UserContact
{
	public int Id { get; set; }

	public int UserId { get; set; }

	public int ContactId { get; set; }

	public DateTime CreatedAt { get; set; }
}