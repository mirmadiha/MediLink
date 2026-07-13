using System.ComponentModel.DataAnnotations;

namespace MediLink.Domain.Entities
{
    public class MedicalRecord
    {
        public int Id { get; set; }

        [Required]
        public string AbhaId { get; set; } = string.Empty;

        [MaxLength(10)]
        public string? BloodGroup { get; set; }

        public double? Height { get; set; }

        public double? Weight { get; set; }

        [MaxLength(100)]
        public string? EmergencyContactName { get; set; }

        [MaxLength(20)]
        public string? EmergencyContactNumber { get; set; }

        public string? MedicalHistory { get; set; }

        public string? CurrentMedications { get; set; }

        public string? Allergies { get; set; }

        public string? Surgeries { get; set; }

        public string? FamilyHistory { get; set; }

        public string? Lifestyle { get; set; }

        public string? DoctorNotes { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}