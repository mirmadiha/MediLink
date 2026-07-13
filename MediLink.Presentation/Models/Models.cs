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

    public class CreateHospitalViewModel
    {
        [Required]
        public string HospitalName { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;
    }

    public class EditHospitalViewModel
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string HospitalName { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;
    }

    public class HospitalOptionViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class CreateAdminViewModel
    {
        [Display(Name = "Name")]
        [Required]
        public string AdminFullName { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Username")]
        [EmailAddress]
        public string AdminEmail { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string AdminPassword { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Contact")]
        public string Contact { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Hospital")]
        public int? HospitalId { get; set; }

        public List<HospitalOptionViewModel> Hospitals { get; set; } = new();
    }

    public class CreateHospitalUserViewModel
    {
        [Display(Name = "Name")]
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Username")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string Specialization { get; set; } = string.Empty;

        [Required]
        [Display(Name = "State Registration Number")]
        public string StateRegistrationNumber { get; set; } = string.Empty;

        [Required]
        public string Role { get; set; } = string.Empty;
    }

    public class ProfileViewModel
    {
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Contact { get; set; }
        public string? Specialization { get; set; }
        public string? StateRegistrationNumber { get; set; }
        public string? AbhaId { get; set; }
        public string? HospitalName { get; set; }
        public string? HospitalAddress { get; set; }
    }

    public class HospitalUserListItemViewModel
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string StateRegistrationNumber { get; set; } = string.Empty;
    }

    public class EditHospitalUserViewModel
    {
        [Required]
        public string Id { get; set; } = string.Empty;

        [Display(Name = "Name")]
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Username")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Specialization { get; set; } = string.Empty;

        [Required]
        [Display(Name = "State Registration Number")]
        public string StateRegistrationNumber { get; set; } = string.Empty;
    }

    public class PatientSignupViewModel
    {
        [Display(Name = "Name")]
        [Required]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Username")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [DataType(DataType.Password)]
        [Compare(nameof(Password), ErrorMessage = "Password and confirmation do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        [Display(Name = "ABHA ID")]
        [RegularExpression("^\\d{14}$", ErrorMessage = "ABHA ID must be exactly 14 digits.")]
        public string AbhaId { get; set; } = string.Empty;

        [Required]
        [Display(Name = "OTP")]
        [RegularExpression("^\\d{4}$", ErrorMessage = "Enter a valid 4-digit OTP.")]
        public string OtpCode { get; set; } = string.Empty;
    }

    public class PatientLookupViewModel
    {
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string AbhaId { get; set; } = string.Empty;
    }

    public class HospitalDoctorsPageViewModel
    {
        public List<HospitalUserListItemViewModel> Doctors { get; set; } = new();
        public string SearchAbhaId { get; set; } = string.Empty;
        public PatientLookupViewModel? Patient { get; set; }
    }

    public class DoctorDashboardViewModel
    {
        public string SearchAbhaId { get; set; } = string.Empty;
        public PatientLookupViewModel? Patient { get; set; }
    }

    public class PrescriptionFormViewModel
    {
        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Required]
        [Display(Name = "Name")]
        public string PatientName { get; set; } = string.Empty;

        [Required]
        public int? Age { get; set; }

        [Required]
        [Display(Name = "Prescription")]
        public string PrescriptionText { get; set; } = string.Empty;

        [Required]
        [Display(Name = "Doctor's Signature")]
        public string DoctorSignature { get; set; } = string.Empty;
    }
}