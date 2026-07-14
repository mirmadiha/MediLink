using MediLink.Domain;
using MediLink.Infrastructure.Identity;
using MediLink.Presentation.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace MediLink.Presentation.Controllers
{
    [Authorize(Roles = Roles.Doctor)]
    public class DoctorController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _environment;

        public DoctorController(UserManager<ApplicationUser> userManager, IWebHostEnvironment environment)
        {
            _userManager = userManager;
            _environment = environment;
        }

        [HttpGet]
        public async Task<IActionResult> Index(string? abhaId = null)
        {
            var model = new DoctorDashboardViewModel
            {
                SearchAbhaId = abhaId ?? string.Empty
            };

            if (!string.IsNullOrWhiteSpace(abhaId))
            {
                var patient = await _userManager.Users
                    .FirstOrDefaultAsync(x => x.AbhaId == abhaId);

                if (patient != null)
                {
                    var roles = await _userManager.GetRolesAsync(patient);
                    if (roles.Contains(Roles.Patient))
                    {
                        model.Patient = new PatientLookupViewModel
                        {
                            FullName = patient.FullName,
                            DateOfBirth = "01-Jan-1990",
                            Age = "36",
                            BloodGroup = "O+",
                            PreviousDiseases = "Diabetes, Heart Palpitations, Asthma"
                        };
                    }
                }
            }

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> AddPrescription(string? abhaId = null)
        {
            if (string.IsNullOrWhiteSpace(abhaId))
            {
                return RedirectToAction(nameof(Index));
            }

            var currentDoctor = await _userManager.GetUserAsync(User);
            var patient = await _userManager.Users.FirstOrDefaultAsync(x => x.AbhaId == abhaId);

            if (patient == null)
            {
                return RedirectToAction(nameof(Index));
            }

            var patientRoles = await _userManager.GetRolesAsync(patient);
            if (!patientRoles.Contains(Roles.Patient))
            {
                return RedirectToAction(nameof(Index));
            }

            return View(new PrescriptionFormViewModel
            {
                Date = DateTime.Today,
                AbhaId = abhaId,
                PatientName = patient.FullName,
                Age = 36,
                DoctorSignature = currentDoctor?.FullName ?? string.Empty
            });
        }

        [HttpPost]
        public async Task<IActionResult> AddPrescription(PrescriptionFormViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var patientUser = await _userManager.Users
                .FirstOrDefaultAsync(x => x.AbhaId == model.AbhaId);

            if (patientUser == null)
            {
                ModelState.AddModelError(string.Empty, "Patient not found for the selected ABHA ID.");
                return View(model);
            }

            var patientRoles = await _userManager.GetRolesAsync(patientUser);
            if (!patientRoles.Contains(Roles.Patient))
            {
                ModelState.AddModelError(string.Empty, "This ABHA ID does not belong to a patient.");
                return View(model);
            }

            var safeAbhaId = SanitizeFileSegment(model.AbhaId);
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var folderPath = GetPrescriptionsFolderPath();
            Directory.CreateDirectory(folderPath);

            var fileName = $"{safeAbhaId}_{timestamp}.txt";
            var filePath = Path.Combine(folderPath, fileName);

            var fileContent = new StringBuilder()
                .AppendLine($"Date: {model.Date:yyyy-MM-dd}")
                .AppendLine($"Name: {model.PatientName}")
                .AppendLine($"Age: {model.Age}")
                .AppendLine("Prescription:")
                .AppendLine(model.PrescriptionText)
                .AppendLine($"Doctor's Signature: {model.DoctorSignature}")
                .ToString();

            await System.IO.File.WriteAllTextAsync(filePath, fileContent);

            TempData["Message"] = "Prescription saved successfully.";
            return RedirectToAction(nameof(AddPrescription), new { abhaId = model.AbhaId });
        }

        [HttpGet]
        public async Task<IActionResult> Prescriptions(string? abhaId = null)
        {
            var model = new DoctorPrescriptionPageViewModel
            {
                AbhaId = abhaId ?? string.Empty
            };

            if (string.IsNullOrWhiteSpace(abhaId))
            {
                return View(model);
            }

            var patientUser = await _userManager.Users.FirstOrDefaultAsync(x => x.AbhaId == abhaId);
            if (patientUser == null)
            {
                ModelState.AddModelError(string.Empty, "Patient not found for this ABHA ID.");
                return View(model);
            }

            var patientRoles = await _userManager.GetRolesAsync(patientUser);
            if (!patientRoles.Contains(Roles.Patient))
            {
                ModelState.AddModelError(string.Empty, "This ABHA ID does not belong to a patient.");
                return View(model);
            }

            model.PatientName = patientUser.FullName;

            var folderPath = GetPrescriptionsFolderPath();
            if (!Directory.Exists(folderPath))
            {
                return View(model);
            }

            var safeAbhaId = SanitizeFileSegment(abhaId);
            var files = Directory.GetFiles(folderPath, $"{safeAbhaId}_*.txt")
                .OrderByDescending(x => x)
                .ToList();

            foreach (var file in files)
            {
                model.Prescriptions.Add(new PrescriptionFileViewModel
                {
                    FileName = Path.GetFileName(file),
                    CreatedOn = System.IO.File.GetCreationTime(file),
                    Content = await System.IO.File.ReadAllTextAsync(file)
                });
            }

            return View(model);
        }

        [HttpGet]
        public IActionResult AISummary()
        {
            return View();
        }

        private string GetPrescriptionsFolderPath()
        {
            return Path.Combine(_environment.ContentRootPath, "Prescriptions");
        }

        private static string SanitizeFileSegment(string value)
        {
            var invalid = Path.GetInvalidFileNameChars();
            var sanitizedChars = value.Select(c => invalid.Contains(c) ? '_' : c).ToArray();
            return new string(sanitizedChars).Replace(' ', '_');
        }
    }
}
