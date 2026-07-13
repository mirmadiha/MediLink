using System.Security.Claims;
using MediLink.Domain;
using MediLink.Domain.Entities;
using MediLink.Infrastructure.Data;
using MediLink.Infrastructure.Identity;
using MediLink.Presentation.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Presentation.Controllers
{
    [Authorize(Roles = Roles.Admin)]
    public class UsersController : Controller
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

        [HttpGet]
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

            var rows = new List<HospitalUserListItemViewModel>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                if (!roles.Contains(Roles.Doctor))
                {
                    continue;
                }

                rows.Add(new HospitalUserListItemViewModel
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email ?? string.Empty,
                    Role = roles.FirstOrDefault() ?? "",
                    Specialization = user.Specialization ?? string.Empty,
                    StateRegistrationNumber = user.StateRegistrationNumber ?? string.Empty
                });
            }

            return View(rows);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View(new CreateHospitalUserViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateHospitalUserViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (model.Role != Roles.Doctor)
            {
                ModelState.AddModelError(nameof(model.Role), "Only Doctor accounts can be created by admin.");
                return View(model);
            }

            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser?.HospitalId == null)
            {
                return Forbid();
            }

            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                ModelState.AddModelError(nameof(model.Email), "Email already exists.");
                return View(model);
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
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                return View(model);
            }

            await _userManager.AddToRoleAsync(user, model.Role);

            TempData["Message"] = $"{model.Role} account created successfully.";
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
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

            return View(new EditHospitalUserViewModel
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Specialization = user.Specialization ?? string.Empty,
                StateRegistrationNumber = user.StateRegistrationNumber ?? string.Empty
            });
        }

        [HttpPost]
        public async Task<IActionResult> Edit(EditHospitalUserViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var currentUser = await _userManager.GetUserAsync(User);
            if (currentUser?.HospitalId == null)
            {
                return Forbid();
            }

            var user = await _userManager.FindByIdAsync(model.Id);
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
                ModelState.AddModelError(nameof(model.Email), "Email already exists.");
                return View(model);
            }

            user.FullName = model.FullName;
            user.Email = model.Email;
            user.UserName = model.Email;
            user.Specialization = model.Specialization;
            user.StateRegistrationNumber = model.StateRegistrationNumber;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                foreach (var error in updateResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                return View(model);
            }

            TempData["Message"] = "Doctor updated successfully.";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
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

            TempData["Message"] = "Doctor deleted successfully.";
            return RedirectToAction(nameof(Index));
        }
    }
}