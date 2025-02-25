﻿using Microsoft.EntityFrameworkCore;
using api.Models;
using Microsoft.Extensions.Hosting;

namespace api.Data;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
	{
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<User>()
			.HasMany(e => e.Contacts)
			.WithMany(e => e.Users)
			.UsingEntity<UserContact>();
	}

	public DbSet<User> Users { get; set; } = null!;
	public DbSet<Contact> Contacts { get; set; } = null!;
	public DbSet<UserContact> UserContacts { get; set; } = null!;
	public DbSet<ContactCustomField> ContactCustomFields { get; set; } = null!;
}