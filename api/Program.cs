using Microsoft.EntityFrameworkCore;
using api.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using api.Authorization;
using api.Services;
using dotenv.net;
using Microsoft.AspNetCore.HttpOverrides;
using System.Net;


DotEnv.Load(options: new DotEnvOptions(ignoreExceptions: true));

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

builder.WebHost.ConfigureKestrel(options =>
{
	options.ListenAnyIP(443);
	options.ListenAnyIP(4200);
});

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
	.AddCookie(options =>
	{
		options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
		options.SlidingExpiration = true;
		options.AccessDeniedPath = "/Forbidden/";
		//options.EventsType = typeof(CustomCookieAuthenticationEvents);
		options.Events.OnRedirectToLogin = (context) =>
		{
			context.Response.StatusCode = 401;
			return Task.CompletedTask;
		};
	});

builder.Services.AddAuthorization(options =>
{
	options.AddPolicy("EditPolicy", policy =>
		policy.Requirements.Add(new SameUserRequirement()));
});

builder.Services.AddSingleton<IAuthorizationHandler, ContactAuthorizationHandler>();
builder.Services.AddScoped<ContactService>();
builder.Services.AddScoped<UserService>();


var connectionString = builder.Configuration.GetValue<string>("DB_CONNECTION_STRING");
builder.Services.AddDbContext<AppDbContext>(options =>
{
	options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddAutoMapper(Assembly.GetExecutingAssembly()); //typeof(MappingProfile)

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication();

var app = builder.Build();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
	ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
});

app.UseAuthentication();
app.UseAuthorization();
var cookiePolicyOptions = new CookiePolicyOptions
{
	MinimumSameSitePolicy = SameSiteMode.Strict,
};
app.UseCookiePolicy(cookiePolicyOptions);

// app.MapRazorPages();
app.MapDefaultControllerRoute();

app.MapControllers();

app.Run();
