using System.Security.Claims;
using MediLink.Domain;
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

            var rows = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                rows.Add(new
                {
                    user.FullName,
                    user.Email,
                    Role = roles.FirstOrDefault() ?? ""
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

            if (model.Role != Roles.Doctor && model.Role != Roles.Patient)
            {
                ModelState.AddModelError(nameof(model.Role), "Only Doctor or Patient can be created.");
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
    }
}