using MediLink.Domain;
using MediLink.Infrastructure.Identity;
using MediLink.Presentation.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Presentation.Controllers
{
    [Authorize(Roles = Roles.Doctor)]
    public class DoctorController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public DoctorController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
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
                            UserName = patient.UserName ?? string.Empty,
                            AbhaId = patient.AbhaId ?? string.Empty
                        };
                    }
                }
            }

            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> AddPrescription()
        {
            var currentDoctor = await _userManager.GetUserAsync(User);

            return View(new PrescriptionFormViewModel
            {
                Date = DateTime.Today,
                DoctorSignature = currentDoctor?.FullName ?? string.Empty
            });
        }

        [HttpPost]
        public IActionResult AddPrescription(PrescriptionFormViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            TempData["Message"] = "Prescription saved successfully.";
            return RedirectToAction(nameof(AddPrescription));
        }

        [HttpGet]
        public IActionResult AISummary()
        {
            return View();
        }
    }
}
