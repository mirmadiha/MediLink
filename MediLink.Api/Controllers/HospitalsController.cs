using MediLink.Api.Models;
using MediLink.Domain;
using MediLink.Domain.Entities;
using MediLink.Infrastructure.Data;
using MediLink.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.MasterAdmin)]
public class HospitalsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public HospitalsController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var hospitals = await _context.Hospitals
            .OrderBy(x => x.Name)
            .Select(x => new HospitalResponse
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address
            })
            .ToListAsync();

        return Ok(hospitals);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHospitalRequest model)
    {
        var hospital = new Hospital
        {
            Name = model.HospitalName,
            Address = model.Address
        };

        _context.Hospitals.Add(hospital);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Hospital created successfully.", id = hospital.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Edit(int id, [FromBody] EditHospitalRequest model)
    {
        var hospital = await _context.Hospitals.FindAsync(id);
        if (hospital == null)
        {
            return NotFound();
        }

        hospital.Name = model.HospitalName;
        hospital.Address = model.Address;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Hospital updated successfully." });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var hospital = await _context.Hospitals.FindAsync(id);
        if (hospital == null)
        {
            return NotFound();
        }

        var linkedUsers = await _context.Users
            .Where(x => x.HospitalId == hospital.Id)
            .ToListAsync();

        foreach (var linkedUser in linkedUsers)
        {
            await _userManager.DeleteAsync(linkedUser);
        }

        _context.Hospitals.Remove(hospital);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Hospital deleted successfully." });
    }

    [HttpGet("options")]
    public async Task<IActionResult> Options()
    {
        var hospitals = await _context.Hospitals
            .OrderBy(x => x.Name)
            .Select(x => new HospitalOptionResponse
            {
                Id = x.Id,
                Name = x.Name
            })
            .ToListAsync();

        return Ok(hospitals);
    }

    [HttpGet("admins/count")]
    public async Task<IActionResult> AdminCount()
    {
        var admins = await _userManager.GetUsersInRoleAsync(Roles.Admin);
        return Ok(new { count = admins.Count });
    }

    [HttpPost("admins")]
    public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminRequest model)
    {
        if (!model.HospitalId.HasValue)
        {
            return BadRequest(new { field = nameof(model.HospitalId), message = "Please select a hospital." });
        }

        var existingHospital = await _context.Hospitals
            .FirstOrDefaultAsync(x => x.Id == model.HospitalId.Value);

        if (existingHospital == null)
        {
            return BadRequest(new { field = nameof(model.HospitalId), message = "Please select a valid hospital." });
        }

        var existingUser = await _userManager.FindByEmailAsync(model.AdminEmail);
        if (existingUser != null)
        {
            return BadRequest(new { field = nameof(model.AdminEmail), message = "Admin email already exists." });
        }

        var adminUser = new ApplicationUser
        {
            UserName = model.AdminEmail,
            Email = model.AdminEmail,
            FullName = model.AdminFullName,
            Contact = model.Contact,
            HospitalId = model.HospitalId,
            EmailConfirmed = true
        };

        var createResult = await _userManager.CreateAsync(adminUser, model.AdminPassword);
        if (!createResult.Succeeded)
        {
            return BadRequest(new
            {
                errors = createResult.Errors.Select(x => x.Description).ToList()
            });
        }

        await _userManager.AddToRoleAsync(adminUser, Roles.Admin);

        return Ok(new { message = "Admin created successfully.", id = adminUser.Id });
    }
}
