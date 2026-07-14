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
            return View(new CreateHospitalViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateHospitalViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var hospital = new Hospital
            {
                Name = model.HospitalName,
                Address = model.Address
            };

            _context.Hospitals.Add(hospital);
            await _context.SaveChangesAsync();

            TempData["Message"] = "Hospital created successfully.";
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var hospital = await _context.Hospitals.FindAsync(id);
            if (hospital == null)
            {
                return NotFound();
            }

            return View(new EditHospitalViewModel
            {
                Id = hospital.Id,
                HospitalName = hospital.Name,
                Address = hospital.Address
            });
        }

        [HttpPost]
        public async Task<IActionResult> Edit(EditHospitalViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var hospital = await _context.Hospitals.FindAsync(model.Id);
            if (hospital == null)
            {
                return NotFound();
            }

            hospital.Name = model.HospitalName;
            hospital.Address = model.Address;
            await _context.SaveChangesAsync();

            TempData["Message"] = "Hospital updated successfully.";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
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

            TempData["Message"] = "Hospital deleted successfully.";
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> CreateAdmin()
        {
            var model = new CreateAdminViewModel
            {
                Hospitals = await _context.Hospitals
                    .OrderBy(x => x.Name)
                    .Select(x => new HospitalOptionViewModel
                    {
                        Id = x.Id,
                        Name = x.Name
                    })
                    .ToListAsync()
            };

            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAdmin(CreateAdminViewModel model)
        {
            model.Hospitals = await _context.Hospitals
                .OrderBy(x => x.Name)
                .Select(x => new HospitalOptionViewModel
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync();

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            if (!model.HospitalId.HasValue)
            {
                ModelState.AddModelError(nameof(model.HospitalId), "Please select a hospital.");
                return View(model);
            }

            var existingHospital = await _context.Hospitals
                .FirstOrDefaultAsync(x => x.Id == model.HospitalId.Value);

            if (existingHospital == null)
            {
                ModelState.AddModelError(nameof(model.HospitalId), "Please select a valid hospital.");
                return View(model);
            }

            var existingUser = await _userManager.FindByEmailAsync(model.AdminEmail);
            if (existingUser != null)
            {
                ModelState.AddModelError(nameof(model.AdminEmail), "Admin email already exists.");
                return View(model);
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
                foreach (var error in createResult.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }
                return View(model);
            }

            await _userManager.AddToRoleAsync(adminUser, Roles.Admin);

            TempData["Message"] = "Admin created successfully.";
            return RedirectToAction(nameof(Index));
        }
    }
}