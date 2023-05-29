using api.Data;
using api.Models;
using Bogus;

public static class DataSeeder
{
	public static void Seed(AppDbContext dbContext)
	{
		if(!dbContext.Users.Any())
		{
			SeedUser(dbContext);
		}
	}

	public static void SeedUser(AppDbContext dbContext)
	{
		var faker = new Faker("en");
		var users = new List<User>()
			{
				new User()
				{
					Username = faker.Internet.UserName(),
					Password = "v"
				}
			};

		dbContext.Users.AddRange(users);
		dbContext.SaveChanges();
	}
}