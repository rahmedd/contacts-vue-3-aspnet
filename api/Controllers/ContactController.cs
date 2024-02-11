using api.Data;
using api.Models;
using api.Models.DTOs;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContactController : ControllerBase
{
	private readonly AppDbContext _context;
	private readonly ContactService _contactService;
	private readonly UserService _userService;
    public string LoggedInUser => User.Identity.Name;

    public ContactController(AppDbContext context, ContactService contactService, UserService userService)
	{
		_context = context;
		_contactService = contactService;
		_userService = userService;
    }

	// GET: api/<ContactsController>/?searchQuery=name
	[Authorize]
	[HttpGet]
	public async Task<ActionResult<BaseResponse<IEnumerable<ContactsGetDto>>>> Get(String? searchQuery)
	{
		User user = await _userService.GetUserByUsernameAsync(LoggedInUser);
		List<ContactsGetDto> contacts = new List<ContactsGetDto>();

		if (searchQuery == null)
		{
			contacts = await _contactService.GetContactsAsync(user);
		}
		else
		{
			contacts = await _contactService.SearchContactsAsync(user, searchQuery);
		}

		var res = new BaseResponse<IEnumerable<ContactsGetDto>>() { Body = contacts };
		return res;
	}

	// GET api/<ContactsController>/5
	[Authorize]
    [HttpGet("{id}")]
	public async Task<ActionResult<BaseResponse<ContactDto>>> Get(int id)
	{
        //return await _context.Contacts.FirstAsync();
        User user = await _userService.GetUserByUsernameAsync(LoggedInUser);
		ContactDto contactDto = await _contactService.GetContactDtoAsync(user, id);

        var res = new BaseResponse<ContactDto>() { Body = contactDto };

        if (contactDto == null)
		{
            res.Success = false;
            return NotFound(res);
        }

        return res;
        
	}

	// POST api/<ContactsController>
	[Authorize]
	[HttpPost]
	public async Task<ActionResult<BaseResponse<ContactDto>>> Post([FromBody] ContactRequestDto contactReq)
	{
        //var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == LoggedInUser
        //return await _context.Contact.FirstAsync();
        User user = await _userService.GetUserByUsernameAsync(LoggedInUser);
        ContactDto createdContact = await _contactService.CreateContactAsync(user, contactReq);

        var res = new BaseResponse<ContactDto> { Body = createdContact };

		return res;

	}

	[Authorize]
	[HttpPut]
	public async Task<ActionResult<BaseResponse<ContactDto>>> Put([FromBody] ContactRequestDto contactReq)
	{
		User user = await _userService.GetUserByUsernameAsync(LoggedInUser);
		ContactDto contactDto = await _contactService.UpdateContactAsync(user, contactReq);
		//ContactDto contactDto = await _contactService.GetContactDtoAsync(user, id);

		var res = new BaseResponse<ContactDto>() { Body = contactDto };

		if (contactDto == null)
		{
			res.Success = false;
			return NotFound(res);
		}

		return res;

	}


	// DELETE api/<ContactsController>/5
	[Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult<BaseResponseEmpty>> Delete(int id)
    {
        User user = await _userService.GetUserByUsernameAsync(LoggedInUser);
        Contact contactDto = await _contactService.DeleteContactAsync(user, id);

		var res = new BaseResponseEmpty();

        if (contactDto == null)
        {
            res.Success = false;
            return NotFound(res);
        }

        return res;

    }
}
