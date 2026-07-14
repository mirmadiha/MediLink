using System.ComponentModel.DataAnnotations;

namespace MediLink.Api.Models;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class PatientSignupRequest
{
    [Display(Name = "Name")]
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Username")]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
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

public class ProfileResponse
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

public class HospitalResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class CreateHospitalRequest
{
    [Required]
    public string HospitalName { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;
}

public class EditHospitalRequest
{
    [Required]
    public string HospitalName { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;
}

public class HospitalOptionResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class CreateAdminRequest
{
    [Display(Name = "Name")]
    [Required]
    public string AdminFullName { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Username")]
    [EmailAddress]
    public string AdminEmail { get; set; } = string.Empty;

    [Required]
    public string AdminPassword { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Contact")]
    public string Contact { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Hospital")]
    public int? HospitalId { get; set; }
}

public class HospitalUserResponse
{
    public string Id { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string StateRegistrationNumber { get; set; } = string.Empty;
}

public class CreateHospitalUserRequest
{
    [Display(Name = "Name")]
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [Display(Name = "Username")]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [Required]
    public string Specialization { get; set; } = string.Empty;

    [Required]
    [Display(Name = "State Registration Number")]
    public string StateRegistrationNumber { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;
}

public class EditHospitalUserRequest
{
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

public class PatientLookupResponse
{
    public string FullName { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
    public string Age { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string PreviousDiseases { get; set; } = string.Empty;
}

public class DoctorDashboardResponse
{
    public string SearchAbhaId { get; set; } = string.Empty;
    public PatientLookupResponse? Patient { get; set; }
}

public class PrescriptionFormResponse
{
    public DateTime Date { get; set; }
    public string AbhaId { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public int? Age { get; set; }
    public string DoctorSignature { get; set; } = string.Empty;
}

public class AddPrescriptionRequest
{
    [Required]
    [DataType(DataType.Date)]
    public DateTime Date { get; set; }

    [Required]
    public string AbhaId { get; set; } = string.Empty;

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

public class PrescriptionFileResponse
{
    public string FileName { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; }
    public string Content { get; set; } = string.Empty;
}

public class DoctorPrescriptionPageResponse
{
    public string AbhaId { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public List<PrescriptionFileResponse> Prescriptions { get; set; } = new();
}

public class PatientPrescriptionPageResponse
{
    public string PatientName { get; set; } = string.Empty;
    public List<PrescriptionFileResponse> Prescriptions { get; set; } = new();
}
