using api.Models.Enums;

namespace api.Models;

public class ContactCustomField
{
	public int Id { get; set; }
	
	public string FieldName { get; set; }

	public string FieldValue { get; set; }

	public ContactCustomFieldTypes FieldType { get; set; }

	public int ContactId { get; set; }

	public Contact Contact { get; set; } = null!;
}
