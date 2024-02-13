using api.Data;
using api.Models;
using api.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Text.RegularExpressions;

namespace api.Services;

public class UserService
{
    private readonly AppDbContext _context;

	public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        User user = await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
        return user;
    }

    public async Task<List<BaseResponseEmpty>> CheckPasswordRequirements(string password)
    {
        List<BaseResponseEmpty> errors = new List<BaseResponseEmpty>();

        String lowercasePattern = "[a-z]";
        String uppercasePattern = "[A-Z]";
        String numberPattern = "[0-9]";

        // length
		if (password.Length < 6)
		{
			errors.Add(new BaseResponseEmpty() { Success = false, Message = "Password must be at least 6 characters" });
		}
        // contains 1 lower
        if (Regex.Count(password, lowercasePattern) < 1)
        {
            errors.Add(new BaseResponseEmpty() { Success = false, Message = "Password must contain at least 1 lowercase character" });
        }
        // contains 1 upper
        if (Regex.Count(password, uppercasePattern) < 1)
        {
            errors.Add(new BaseResponseEmpty() { Success = false, Message = "Password must contain at least 1 uppercase character" });
        }
        // contains 1 number
        if (Regex.Count(password, numberPattern) < 1)
        {
            errors.Add(new BaseResponseEmpty() { Success = false, Message = "Password must contain at least 1 number" });
        }

        return errors;
    }

    public async Task<UserDto> CreateUserAsync(LoginDto loginDto)
    {
        var requirementErrors = await CheckPasswordRequirements(loginDto.Password);
        if (requirementErrors.Count > 0)
        {
            throw new Exception("User does not meet password requirements");
        }

		User existingUser = await GetUserByUsernameAsync(loginDto.Username);
		if (existingUser != null)
		{
			throw new Exception("User already exists");
		}

		string hashedPass = BCrypt.Net.BCrypt.HashPassword(loginDto.Password);

		var user = new User()
		{
			Username = loginDto.Username,
			Password = hashedPass,
			CreatedAt = DateTime.UtcNow,
		};

		await _context.Users.AddAsync(user);
		await _context.SaveChangesAsync();

		UserDto userDto = new UserDto()
		{
			Id = user.Id,
			Username = user.Username,
		};

		return userDto;
	}

	public async Task<bool> ValidateUser(User user, LoginDto loginDto)
	{
		bool res = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
		return res;
	}
}
