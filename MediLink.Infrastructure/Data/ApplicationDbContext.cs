using MediLink.Domain.Entities;
using MediLink.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<Hospital> Hospitals => Set<Hospital>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Hospital>(entity =>
            {
                entity.Property(x => x.Name).HasMaxLength(200).IsRequired();
            });

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(x => x.FullName).HasMaxLength(200).IsRequired();
            });
        }
    }
}
