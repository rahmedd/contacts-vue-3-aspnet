using api.Data;
using api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using api.Models.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
	private readonly AppDbContext _context;
	private readonly IMapper _mapper;

	public AuthController(AppDbContext context, IMapper mapper)
	{
		_context = context;
		_mapper = mapper;
	}

	[Authorize]
	[HttpGet("User")]
	public async Task<ActionResult<BaseResponseEmpty>> GetUser()
	{
		var res = new BaseResponseEmpty { Success = true, Message = "" };
		return Ok(res);
	}

	[HttpPost("Signup")]
	public async Task<ActionResult<BaseResponse<UserDto>>> PostSignup([FromBody] LoginDto signup)
	{
		var user = new User()
		{
			Username = signup.Username,
			Password = signup.Password,
			CreatedAt = DateTime.UtcNow,
		};

		await _context.Users.AddAsync(user);
		await _context.SaveChangesAsync();

		//var userDto = _mapper.Map<UserDto>(user);
		UserDto userDto = new UserDto()
		{
			Id = user.Id,
			Username = user.Username,
		};

		var res = new BaseResponse<UserDto> { Success = true, Message = "", Body = userDto };
		return Ok(res);
	}

	[HttpPost("Login")]
	public async Task<ActionResult<BaseResponse<UserDto>>> PostLogin([FromBody] LoginDto loginDto)
	{
		if (loginDto == null || loginDto.Username == null || loginDto.Password == null)
		{
			return Unauthorized();
		}

		User user = await _context.Users.FirstOrDefaultAsync(m => m.Username == loginDto.Username);
		if (user == null)
		{
			return BadRequest(new BaseResponseEmpty() { Success = false, Message = "Error logging in" });
		}

		var claims = new List<Claim>
		{
			new Claim(ClaimTypes.Name, user.Username),
			new Claim(ClaimTypes.Sid, user.Id.ToString()),
		};

		var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

		var authProperties = new AuthenticationProperties
		{
			//AllowRefresh = <bool>,
			// Refreshing the authentication session should be allowed.

			//ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(10),
			// The time at which the authentication ticket expires. A 
			// value set here overrides the ExpireTimeSpan option of 
			// CookieAuthenticationOptions set with AddCookie.

			//IsPersistent = true,
			// Whether the authentication session is persisted across 
			// multiple requests. When used with cookies, controls
			// whether the cookie's lifetime is absolute (matching the
			// lifetime of the authentication ticket) or session-based.

			//IssuedUtc = <DateTimeOffset>,
			// The time at which the authentication ticket was issued.

			//RedirectUri = <string>
			// The full path or absolute URI to be used as an http 
			// redirect response value.
			IsPersistent = true,
			AllowRefresh = true,
			ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60),
		};

		await HttpContext.SignInAsync(
			CookieAuthenticationDefaults.AuthenticationScheme,
			new ClaimsPrincipal(claimsIdentity),
			authProperties
		);

		//UserDto userDto = _mapper.Map<UserDto>(user);
		UserDto userDto = new UserDto()
		{
			Id = user.Id,
			Username = user.Username,
		};

		var res = new BaseResponse<UserDto> { Success = true, Message = "", Body = userDto };
		return Ok(res);
	}
}