namespace api.Models;

public class UserContact
{
	public int Id { get; set; }

	public int UserId { get; set; }

	public int ContactId { get; set; }

	public User User { get; set; } = null!;

	public Contact Contact { get; set; } = null!;

	public DateTime CreatedAt { get; set; }

	public bool IsOwner { get; set; }
}