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
                entity.Property(x => x.Address).HasMaxLength(300).IsRequired();
            });

            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(x => x.FullName).HasMaxLength(200).IsRequired();
                entity.Property(x => x.Contact).HasMaxLength(50);
                entity.Property(x => x.Specialization).HasMaxLength(150);
                entity.Property(x => x.StateRegistrationNumber).HasMaxLength(100);
                entity.Property(x => x.AbhaId).HasMaxLength(100);
                entity.HasIndex(x => x.AbhaId)
                    .IsUnique()
                    .HasFilter("[AbhaId] IS NOT NULL");
            });
        }
    }
}
