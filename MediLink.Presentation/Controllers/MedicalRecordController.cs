using MediLink.Domain.Entities;
using MediLink.Infrastructure.Data;
using MediLink.Presentation.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Presentation.Controllers
{
    public class MedicalRecordController : Controller
    {
        private readonly ApplicationDbContext _context;

        public MedicalRecordController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: MedicalRecord/Details?abhaId=12345678901234
        [HttpGet]
        public async Task<IActionResult> Index(string abhaId)
        {
            if (string.IsNullOrWhiteSpace(abhaId))
                return NotFound();

            var medicalRecord = await _context.MedicalRecords
                .FirstOrDefaultAsync(x => x.AbhaId == abhaId);

            if (medicalRecord == null)
            {
                medicalRecord = new MedicalRecord
                {
                    AbhaId = abhaId
                };

                _context.MedicalRecords.Add(medicalRecord);
                await _context.SaveChangesAsync();
            }

            var model = new MedicalRecordViewModel
            {
                Id = medicalRecord.Id,
                AbhaId = medicalRecord.AbhaId,
                BloodGroup = medicalRecord.BloodGroup,
                Height = medicalRecord.Height,
                Weight = medicalRecord.Weight,
                EmergencyContactName = medicalRecord.EmergencyContactName,
                EmergencyContactNumber = medicalRecord.EmergencyContactNumber,
                MedicalHistory = medicalRecord.MedicalHistory,
                CurrentMedications = medicalRecord.CurrentMedications,
                Allergies = medicalRecord.Allergies,
                Surgeries = medicalRecord.Surgeries,
                FamilyHistory = medicalRecord.FamilyHistory,
                Lifestyle = medicalRecord.Lifestyle,
                DoctorNotes = medicalRecord.DoctorNotes
            };

            return View(model);
        }

        // POST: MedicalRecord/Details
        [HttpPost]
        public async Task<IActionResult> Index(MedicalRecordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Find by ABHA ID instead of Id
            var medicalRecord = await _context.MedicalRecords
                .FirstOrDefaultAsync(x => x.AbhaId == model.AbhaId);

            // If no record exists, create one
            if (medicalRecord == null)
            {
                medicalRecord = new MedicalRecord
                {
                    AbhaId = model.AbhaId
                };

                _context.MedicalRecords.Add(medicalRecord);
            }

            // Update fields
            medicalRecord.BloodGroup = model.BloodGroup;
            medicalRecord.Height = model.Height;
            medicalRecord.Weight = model.Weight;
            medicalRecord.EmergencyContactName = model.EmergencyContactName;
            medicalRecord.EmergencyContactNumber = model.EmergencyContactNumber;
            medicalRecord.MedicalHistory = model.MedicalHistory;
            medicalRecord.CurrentMedications = model.CurrentMedications;
            medicalRecord.Allergies = model.Allergies;
            medicalRecord.Surgeries = model.Surgeries;
            medicalRecord.FamilyHistory = model.FamilyHistory;
            medicalRecord.Lifestyle = model.Lifestyle;
            medicalRecord.DoctorNotes = model.DoctorNotes;
            medicalRecord.UpdatedAt = DateTime.Now;


            Console.WriteLine($"ABHA: {model.AbhaId}");
            Console.WriteLine($"Blood Group: {model.BloodGroup}");
            Console.WriteLine($"Medical History: {model.MedicalHistory}");

            await _context.SaveChangesAsync();

            TempData["Message"] = "Medical record saved successfully.";

            return RedirectToAction(nameof(Index), new { abhaId = model.AbhaId });
        }
    }
}