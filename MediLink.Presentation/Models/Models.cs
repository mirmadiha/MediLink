using System.ComponentModel.DataAnnotations;

namespace MediLink.Presentation.Models
{
    public class LoginViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }

    public class CreateHospitalAdminViewModel
    {
        [Required]
        public string HospitalName { get; set; } = string.Empty;

        [Required]
        public string AdminFullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string AdminEmail { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string AdminPassword { get; set; } = string.Empty;
    }

    public class CreateHospitalUserViewModel
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;
    }
}