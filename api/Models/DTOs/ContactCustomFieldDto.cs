using api.Models.Enums;

namespace api.Models.DTOs;

public class ContactCustomFieldDto
{
    public int Id { get; set; }

    public string FieldName { get; set; }

    public string FieldValue { get; set; }

    public ContactCustomFieldTypes FieldType { get; set; }
}
