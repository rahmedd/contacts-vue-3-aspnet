using api.Data;
using api.Models;
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
        User user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        return user;
    }
}
