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
    [Authorize(Roles = Roles.MasterAdmin)]
    public class HospitalsController : Controller
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
                .ToListAsync();

            return View(hospitals);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View(new CreateHospitalAdminViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateHospitalAdminViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var existingUser = await _userManager.FindByEmailAsync(model.AdminEmail);
            if (existingUser != null)
            {
                ModelState.AddModelError(nameof(model.AdminEmail), "Admin email already exists.");
                return View(model);
            }

            var hospital = new Hospital
            {
                Name = model.HospitalName
            };

            _context.Hospitals.Add(hospital);
            await _context.SaveChangesAsync();

            var adminUser = new ApplicationUser
            {
                UserName = model.AdminEmail,
                Email = model.AdminEmail,
                FullName = model.AdminFullName,
                HospitalId = hospital.Id,
                EmailConfirmed = true
            };

            var createResult = await _userManager.CreateAsync(adminUser, model.AdminPassword);
            if (!createResult.Succeeded)
            {
                foreach (var error in createResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                _context.Hospitals.Remove(hospital);
                await _context.SaveChangesAsync();
                return View(model);
            }

            await _userManager.AddToRoleAsync(adminUser, Roles.Admin);

            TempData["Message"] = "Hospital and Admin created successfully.";
            return RedirectToAction(nameof(Index));
        }
    }
}