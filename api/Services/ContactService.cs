using api.Data;
using api.Models;
using api.Models.DTOs;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services;

public class ContactService
{
	private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public ContactService(AppDbContext context, IMapper mapper)
	{
		_context = context;
        _mapper = mapper;
        
	}

	public async Task<ContactDto> CreateContactAsync(User user, ContactRequestDto contactDto)
	{
		Contact contact = new()
		{
			Firstname = contactDto.Firstname,
			Lastname = contactDto.Lastname,
			Users = new List<User>() { user },
            CustomFields = new List<ContactCustomField>()
		};

        // Add fields
        foreach (ContactCustomFieldDto field in contactDto.CustomFields)
        {
            ContactCustomField customField = new()
            {
                Contact = contact,
                FieldName = field.FieldName,
                FieldValue = field.FieldValue,
                FieldType = field.FieldType
            };

            contact.CustomFields.Add(customField);
        }

        // Save changes
        await _context.AddAsync(contact);
        await _context.SaveChangesAsync();

        ContactDto contactRes = _mapper.Map<ContactDto>(contact);

        return contactRes;
	}

	public async Task<List<ContactDto>> GetContactsAsync(User user)
	{
        var contactsQuery = _context.Contacts
            .Where(c => c.Users
                .Any(u => u.Id == user.Id)
            )
            .Include(c => c.Users)
            .Include(c => c.CustomFields);

        var contacts = await contactsQuery.ToListAsync();


        List<ContactDto> contactsToDto = _mapper.Map<List<ContactDto>>(contacts);

        return contactsToDto;
	}

    public async Task<ContactDto> GetContactAsync(User user, int contactId)
    {
        //var contactsQuery = _context.Contacts
        //    .Where(c => c.Users
        //        .Any(u => u.Id == user.Id)
        //    )
        //    .Where(c => c.Id == contactId)
        //    .Include(c => c.Users)
        //    .Include(c => c.CustomFields);

        //var contacts = await contactsQuery.ToListAsync();

        Contact contact = await _context.Contacts.FirstOrDefaultAsync(c => c.Id == contactId && c.Users.Any(u => u.Id == user.Id));


        ContactDto contactDto = _mapper.Map<ContactDto>(contact);

        return contactDto;
    }
}
