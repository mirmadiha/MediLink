using MediLink.Api.Models;
using MediLink.Domain;
using MediLink.Infrastructure.Data;
using MediLink.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = Roles.Admin)]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ApplicationDbContext _context;

    public UsersController(
        UserManager<ApplicationUser> userManager,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    [HttpGet("doctors")]
    public async Task<IActionResult> Index()
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser?.HospitalId == null)
        {
            return Forbid();
        }

        var users = await _context.Users
            .Where(x => x.HospitalId == currentUser.HospitalId)
            .OrderBy(x => x.FullName)
            .ToListAsync();

        var rows = new List<HospitalUserResponse>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains(Roles.Doctor))
            {
                continue;
            }

            rows.Add(new HospitalUserResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Role = Roles.Doctor,
                Specialization = user.Specialization ?? string.Empty,
                StateRegistrationNumber = user.StateRegistrationNumber ?? string.Empty
            });
        }

        return Ok(rows);
    }

    [HttpPost("doctors")]
    public async Task<IActionResult> Create([FromBody] CreateHospitalUserRequest model)
    {
        if (model.Role != Roles.Doctor)
        {
            return BadRequest(new { field = nameof(model.Role), message = "Only Doctor accounts can be created by admin." });
        }

        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser?.HospitalId == null)
        {
            return Forbid();
        }

        var existingUser = await _userManager.FindByEmailAsync(model.Email);
        if (existingUser != null)
        {
            return BadRequest(new { field = nameof(model.Email), message = "Email already exists." });
        }

        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            FullName = model.FullName,
            Specialization = model.Specialization,
            StateRegistrationNumber = model.StateRegistrationNumber,
            HospitalId = currentUser.HospitalId,
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

        await _userManager.AddToRoleAsync(user, model.Role);

        return Ok(new { message = $"{model.Role} account created successfully.", id = user.Id });
    }

    [HttpGet("doctors/{id}")]
    public async Task<IActionResult> Edit(string id)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser?.HospitalId == null)
        {
            return Forbid();
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user == null || user.HospitalId != currentUser.HospitalId)
        {
            return NotFound();
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains(Roles.Doctor))
        {
            return Forbid();
        }

        return Ok(new HospitalUserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            Role = Roles.Doctor,
            Specialization = user.Specialization ?? string.Empty,
            StateRegistrationNumber = user.StateRegistrationNumber ?? string.Empty
        });
    }

    [HttpPut("doctors/{id}")]
    public async Task<IActionResult> Edit(string id, [FromBody] EditHospitalUserRequest model)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser?.HospitalId == null)
        {
            return Forbid();
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user == null || user.HospitalId != currentUser.HospitalId)
        {
            return NotFound();
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains(Roles.Doctor))
        {
            return Forbid();
        }

        var emailOwner = await _userManager.FindByEmailAsync(model.Email);
        if (emailOwner != null && emailOwner.Id != user.Id)
        {
            return BadRequest(new { field = nameof(model.Email), message = "Email already exists." });
        }

        user.FullName = model.FullName;
        user.Email = model.Email;
        user.UserName = model.Email;
        user.Specialization = model.Specialization;
        user.StateRegistrationNumber = model.StateRegistrationNumber;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            return BadRequest(new
            {
                errors = updateResult.Errors.Select(x => x.Description).ToList()
            });
        }

        return Ok(new { message = "Doctor updated successfully." });
    }

    [HttpDelete("doctors/{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var currentUser = await _userManager.GetUserAsync(User);
        if (currentUser?.HospitalId == null)
        {
            return Forbid();
        }

        var user = await _userManager.FindByIdAsync(id);
        if (user == null || user.HospitalId != currentUser.HospitalId)
        {
            return NotFound();
        }

        var roles = await _userManager.GetRolesAsync(user);
        if (!roles.Contains(Roles.Doctor))
        {
            return Forbid();
        }

        await _userManager.DeleteAsync(user);

        return Ok(new { message = "Doctor deleted successfully." });
    }
}
