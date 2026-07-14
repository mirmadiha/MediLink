using MediLink.Api.Models;
using MediLink.Api.Services;
using MediLink.Domain;
using MediLink.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.Doctor)]
public class DoctorController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IPrescriptionStorageService _prescriptionStorage;

    public DoctorController(
        UserManager<ApplicationUser> userManager,
        IPrescriptionStorageService prescriptionStorage)
    {
        _userManager = userManager;
        _prescriptionStorage = prescriptionStorage;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Index([FromQuery] string? abhaId = null)
    {
        var model = new DoctorDashboardResponse
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
                    model.Patient = new PatientLookupResponse
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

        return Ok(model);
    }

    [HttpGet("prescription-form")]
    public async Task<IActionResult> AddPrescriptionForm([FromQuery] string? abhaId = null)
    {
        if (string.IsNullOrWhiteSpace(abhaId))
        {
            return BadRequest(new { message = "ABHA ID is required." });
        }

        var currentDoctor = await _userManager.GetUserAsync(User);
        var patient = await _userManager.Users.FirstOrDefaultAsync(x => x.AbhaId == abhaId);

        if (patient == null)
        {
            return NotFound(new { message = "Patient not found." });
        }

        var patientRoles = await _userManager.GetRolesAsync(patient);
        if (!patientRoles.Contains(Roles.Patient))
        {
            return BadRequest(new { message = "This ABHA ID does not belong to a patient." });
        }

        return Ok(new PrescriptionFormResponse
        {
            Date = DateTime.Today,
            AbhaId = abhaId,
            PatientName = patient.FullName,
            Age = 36,
            DoctorSignature = currentDoctor?.FullName ?? string.Empty
        });
    }

    [HttpPost("prescriptions")]
    public async Task<IActionResult> AddPrescription([FromBody] AddPrescriptionRequest model)
    {
        var patientUser = await _userManager.Users
            .FirstOrDefaultAsync(x => x.AbhaId == model.AbhaId);

        if (patientUser == null)
        {
            return BadRequest(new { message = "Patient not found for the selected ABHA ID." });
        }

        var patientRoles = await _userManager.GetRolesAsync(patientUser);
        if (!patientRoles.Contains(Roles.Patient))
        {
            return BadRequest(new { message = "This ABHA ID does not belong to a patient." });
        }

        var fileName = await _prescriptionStorage.SaveAsync(model);
        return Ok(new { message = "Prescription saved successfully.", fileName });
    }

    [HttpGet("prescriptions")]
    public async Task<IActionResult> Prescriptions([FromQuery] string? abhaId = null)
    {
        var model = new DoctorPrescriptionPageResponse
        {
            AbhaId = abhaId ?? string.Empty
        };

        if (string.IsNullOrWhiteSpace(abhaId))
        {
            return Ok(model);
        }

        var patientUser = await _userManager.Users.FirstOrDefaultAsync(x => x.AbhaId == abhaId);
        if (patientUser == null)
        {
            return NotFound(new { message = "Patient not found for this ABHA ID." });
        }

        var patientRoles = await _userManager.GetRolesAsync(patientUser);
        if (!patientRoles.Contains(Roles.Patient))
        {
            return BadRequest(new { message = "This ABHA ID does not belong to a patient." });
        }

        model.PatientName = patientUser.FullName;
        model.Prescriptions = await _prescriptionStorage.GetByAbhaIdAsync(abhaId);

        return Ok(model);
    }

    [HttpGet("reports")]
    public async Task<IActionResult> Reports([FromQuery] string? abhaId = null)
    {
        if (string.IsNullOrWhiteSpace(abhaId))
        {
            return Ok(new List<PrescriptionFileResponse>());
        }

        var patientUser = await _userManager.Users.FirstOrDefaultAsync(x => x.AbhaId == abhaId);
        if (patientUser == null)
        {
            return NotFound(new { message = "Patient not found for this ABHA ID." });
        }

        var patientRoles = await _userManager.GetRolesAsync(patientUser);
        if (!patientRoles.Contains(Roles.Patient))
        {
            return BadRequest(new { message = "This ABHA ID does not belong to a patient." });
        }

        var reports = await _prescriptionStorage.GetReportsByAbhaIdAsync(abhaId);
        return Ok(reports);
    }

    [HttpGet("ai-summary")]
    public IActionResult AISummary()
    {
        return Ok(new { message = "AI summary view placeholder." });
    }
}
