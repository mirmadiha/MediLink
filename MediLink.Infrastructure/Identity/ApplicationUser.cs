using Microsoft.AspNetCore.Identity;

namespace MediLink.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public int? HospitalId { get; set; }
    }
}
