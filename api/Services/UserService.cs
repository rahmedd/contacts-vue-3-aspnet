using api.Data;
using api.Models;
using api.Models.DTOs;
using Microsoft.EntityFrameworkCore;

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

    public async Task<UserDto> CreateUserAsync(LoginDto loginDto)
    {
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
