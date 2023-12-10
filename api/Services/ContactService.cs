﻿using api.Data;
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

	public async Task<ContactDto> UpdateContactAsync(User user, ContactRequestDto contactDto)
	{
		var contact = await GetContactAsync(user, contactDto.Id);
		if (contact == null)
		{
			throw new Exception("Contact not found");
		}

		contact.Firstname = contactDto.Firstname;
		contact.Lastname = contactDto.Lastname;

		// Update fields
		foreach (ContactCustomFieldDto field in contactDto.CustomFields)
		{
			if (field.Id == null) { continue; }

			var cf = _context.ContactCustomFields.First(x => x.Id == field.Id && x.Contact.Id == contact.Id);
			cf.FieldName = field.FieldName;
			cf.FieldValue = field.FieldValue;
			cf.FieldType = field.FieldType;
		}

		// Add fields 
		foreach (ContactCustomFieldDto field in contactDto.CustomFields)
		{
			if (field.Id != null) { continue; }

			ContactCustomField customField = new()
			{
				Contact = contact,
				FieldName = field.FieldName,
				FieldValue = field.FieldValue,
				FieldType = field.FieldType
			};

			contact.CustomFields.Add(customField);
		}

		await _context.SaveChangesAsync();
		ContactDto contactRes = _mapper.Map<ContactDto>(contact);

		return contactRes;
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

	private async Task<Contact> GetContactAsync(User user, int contactId)
	{
		var contactsQuery = _context.Contacts
			.Where(c => c.Users
				.Any(u => u.Id == user.Id)
			//.Any(u => u.Id == user.Id && u.Contacts.Any(c => c.Id == contactId)
			)
			.Where(c => c.Id == contactId)
			.Include(c => c.Users)
			.Include(c => c.CustomFields);

		var contact = await contactsQuery.FirstOrDefaultAsync();

		return contact;
	}

	public async Task<ContactDto> GetContactDtoAsync(User user, int contactId)
	{
		Contact contact = await GetContactAsync(user, contactId);
		ContactDto contactDto = _mapper.Map<ContactDto>(contact);

		return contactDto;
	}
}
