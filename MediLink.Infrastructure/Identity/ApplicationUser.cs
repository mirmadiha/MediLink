using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediLink.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        [Column("Name")]
        public string FullName { get; set; } = string.Empty;

        [Column("Contact")]
        public string? Contact { get; set; }

        [Column("Specialization")]
        public string? Specialization { get; set; }

        [Column("StateRegistrationNumber")]
        public string? StateRegistrationNumber { get; set; }

        [Column("AbhaId")]
        public string? AbhaId { get; set; }

        public int? HospitalId { get; set; }
    }
}
