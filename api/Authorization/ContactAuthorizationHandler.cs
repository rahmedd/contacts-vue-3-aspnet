using api.Models;
using Microsoft.AspNetCore.Authorization;

namespace api.Authorization;

public class ContactAuthorizationHandler : AuthorizationHandler<SameUserRequirement, Contact>
{
	protected override Task HandleRequirementAsync(AuthorizationHandlerContext context,
												   SameUserRequirement requirement,
												   Contact resource)
	{
		var username = context.User.Identity?.Name;
		var user = resource.Users.First(x => x.Username == username);
		if (user != null)
		{
			context.Succeed(requirement);
		}

		return Task.CompletedTask;
	}
}

public class SameUserRequirement : IAuthorizationRequirement { }