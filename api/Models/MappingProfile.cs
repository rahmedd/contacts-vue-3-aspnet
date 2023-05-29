using api.Models.DTOs;
using AutoMapper;

namespace api.Models;

public class MappingProfile : Profile
{
	public MappingProfile() {
		CreateMap<User, UserDto>();
		CreateMap<Contact, ContactDto>();
		CreateMap<ContactCustomField, ContactCustomFieldDto>();
	}
}
