using MediLink.Infrastructure.Identity;
using MediLink.Domain;
using MediLink.Infrastructure.Data;
using MediLink.Presentation.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MediLink.Presentation.Controllers
{
    public class AccountController : Controller
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;

        public AccountController(
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login(string? returnUrl = null)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View(new LoginViewModel());
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.ReturnUrl = returnUrl;
                return View(model);
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            var result = await _signInManager.PasswordSignInAsync(
                user.UserName!,
                model.Password,
                isPersistent: false,
                lockoutOnFailure: false);

            if (!result.Succeeded)
            {
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            if (!string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Signup()
        {
            return View(new PatientSignupViewModel());
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Signup(PatientSignupViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var existingUser = await _userManager.FindByEmailAsync(model.Email);
            if (existingUser != null)
            {
                ModelState.AddModelError(nameof(model.Email), "Email already exists.");
                return View(model);
            }

            var existingAbhaUser = await _userManager.Users
                .FirstOrDefaultAsync(x => x.AbhaId == model.AbhaId);
            if (existingAbhaUser != null)
            {
                ModelState.AddModelError(nameof(model.AbhaId), "ABHA ID already exists.");
                return View(model);
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
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError(string.Empty, error.Description);
                }

                return View(model);
            }

            await _userManager.AddToRoleAsync(user, Roles.Patient);
            await _signInManager.SignInAsync(user, isPersistent: false);

            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Login", "Account");
        }

        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Profile()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return RedirectToAction(nameof(Login));
            }

            var roles = await _userManager.GetRolesAsync(user);
            var hospital = user.HospitalId.HasValue
                ? await _context.Hospitals.FirstOrDefaultAsync(x => x.Id == user.HospitalId.Value)
                : null;

            return View(new ProfileViewModel
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
    }
}