using MediLink.Api.Models;
using MediLink.Api.Services;
using MediLink.Domain;
using MediLink.Infrastructure.Data;
using MediLink.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace MediLink.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly IPrescriptionStorageService _prescriptionStorage;

    public AccountController(
        SignInManager<ApplicationUser> signInManager,
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context,
        IPrescriptionStorageService prescriptionStorage)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _context = context;
        _prescriptionStorage = prescriptionStorage;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest model, [FromQuery] string? returnUrl = null)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var result = await _signInManager.PasswordSignInAsync(
            user.UserName!,
            model.Password,
            isPersistent: false,
            lockoutOnFailure: false);

        if (!result.Succeeded)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var targetUrl = !string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl)
            ? returnUrl
            : "/";

        return Ok(new { message = "Login successful.", returnUrl = targetUrl });
    }

    [HttpPost("signup")]
    [AllowAnonymous]
    public async Task<IActionResult> Signup([FromBody] PatientSignupRequest model)
    {
        var existingUser = await _userManager.FindByEmailAsync(model.Email);
        if (existingUser != null)
        {
            return BadRequest(new { field = nameof(model.Email), message = "Email already exists." });
        }

        var existingAbhaUser = await _userManager.Users
            .FirstOrDefaultAsync(x => x.AbhaId == model.AbhaId);
        if (existingAbhaUser != null)
        {
            return BadRequest(new { field = nameof(model.AbhaId), message = "ABHA ID already exists." });
        }

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FullName = model.FullName,
            AbhaId = model.AbhaId,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                errors = result.Errors.Select(x => x.Description).ToList()
            });
        }

        await _userManager.AddToRoleAsync(user, Roles.Patient);
        await _signInManager.SignInAsync(user, isPersistent: false);

        return Ok(new { message = "Signup successful." });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok(new { message = "Logout successful." });
    }

    [HttpGet("access-denied")]
    [AllowAnonymous]
    public IActionResult AccessDenied()
    {
        return StatusCode(StatusCodes.Status403Forbidden, new { message = "Access denied." });
    }

    [HttpGet("profile")]
    [Authorize]
    public async Task<IActionResult> Profile()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        var roles = await _userManager.GetRolesAsync(user);
        var hospital = user.HospitalId.HasValue
            ? await _context.Hospitals.FirstOrDefaultAsync(x => x.Id == user.HospitalId.Value)
            : null;

        return Ok(new ProfileResponse
        {
            FullName = user.FullName,
            UserName = user.UserName ?? string.Empty,
            Role = roles.FirstOrDefault() ?? string.Empty,
            Contact = user.Contact,
            Specialization = user.Specialization,
            StateRegistrationNumber = user.StateRegistrationNumber,
            AbhaId = user.AbhaId,
            HospitalName = hospital?.Name,
            HospitalAddress = hospital?.Address
        });
    }

    [HttpGet("my-prescriptions")]
    [Authorize(Roles = Roles.Patient)]
    public async Task<IActionResult> MyPrescriptions()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        var model = new PatientPrescriptionPageResponse
        {
            PatientName = user.FullName
        };

        if (string.IsNullOrWhiteSpace(user.AbhaId))
        {
            return Ok(model);
        }

        model.Prescriptions = await _prescriptionStorage.GetByAbhaIdAsync(user.AbhaId);
        return Ok(model);
    }

    [HttpGet("my-reports")]
    [Authorize(Roles = Roles.Patient)]
    public async Task<IActionResult> MyReports()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        if (string.IsNullOrWhiteSpace(user.AbhaId))
        {
            return Ok(new List<PrescriptionFileResponse>());
        }

        var reports = await _prescriptionStorage.GetReportsByAbhaIdAsync(user.AbhaId);
        return Ok(reports);
    }

    [HttpPost("my-reports")]
    [Authorize(Roles = Roles.Patient)]
    public async Task<IActionResult> UploadMyReport([FromForm] UploadReportRequest model)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
        {
            return Unauthorized(new { message = "User not found." });
        }

        if (string.IsNullOrWhiteSpace(user.AbhaId))
        {
            return BadRequest(new { message = "ABHA ID missing for this patient." });
        }

        if (model.File == null || model.File.Length == 0)
        {
            return BadRequest(new { message = "Report file is required." });
        }

        if (string.IsNullOrWhiteSpace(model.Title))
        {
            return BadRequest(new { message = "Report title is required." });
        }

        if (string.IsNullOrWhiteSpace(model.Type))
        {
            return BadRequest(new { message = "Report type is required." });
        }

        var extension = Path.GetExtension(model.File.FileName);
        if (!string.Equals(extension, ".txt", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Only .txt report files are allowed." });
        }

        string content;
        using (var reader = new StreamReader(model.File.OpenReadStream()))
        {
            content = await reader.ReadToEndAsync();
        }

        var fileName = await _prescriptionStorage.SaveReportAsync(
            user.AbhaId,
            model.Title.Trim(),
            model.Type.Trim(),
            model.Date,
            model.Hospital,
            model.Notes,
            content);

        return Ok(new { message = "Report uploaded successfully.", fileName });
    }
}
