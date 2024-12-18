using CarLoan.Server.DbContext;
using CarLoan.Server.Models;
using CarLoan.Server.Services.Abstract;
using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace CarLoan.Server.Controllers
{
   // [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountServices _accountService;
        private readonly LoansDbContext _context;
        private JWTSettings JWTSettings { get; }
        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager; 

        public AccountController(IAccountServices accountService, IOptions<JWTSettings> jwtSettings,
            UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, LoansDbContext context)
        {
            _accountService = accountService;
            JWTSettings = jwtSettings?.Value;
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        [Route("~/api/login")]
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginRequests login)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    login.UserName = login.UserName.Trim();
                    var res = await AuthenticateUser(login);
                    return Ok(res);
                }
                else
                {
                    return Ok(ModelState);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred during login.", Error = ex.Message });
            }
        }





        private async Task<IActionResult> AuthenticateUser(LoginRequests login)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(login.UserName) || string.IsNullOrWhiteSpace(login.Password))
                {
                    return BadRequest(new { Message = "Username and password must be provided." });
                }

                string userName = login.UserName.Trim();

                var user = await _userManager.FindByNameAsync(userName);
                if (user == null)
                {
                    return NotFound(new { Message = "User not found." });
                }
                var isPasswordValid = await _userManager.CheckPasswordAsync(user, login.Password.Trim());
                if (!isPasswordValid)
                {
                    return Unauthorized(new { Message = "Invalid username or password." });
                }
                if (!user.IsActive)
                {
                    return NotFound(new { Message = "User account is inactive." });
                }
                var roles = await _userManager.GetRolesAsync(user);
                var token = GenerateJSONWebToken(user, roles);
                return Ok(new
                {
                    Message = "Authentication successful.",
                    User = new
                    {
                        user.Id,
                        //user.UserName,
                        user.Email,
                        Roles = roles,
                        Token = token
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred during authentication.", Error = ex.Message });
            }
        }



        private string GenerateJSONWebToken(ApplicationUser user, IList<string> roles)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTSettings.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim("Username", user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var token = new JwtSecurityToken(
                issuer: JWTSettings.Issuer,
                audience: JWTSettings.Issuer,
            claims: claims,
                expires: DateTime.Now.AddMinutes(JWTSettings.TokenExpiry_Minutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        [HttpGet("email-exists")]
        public async Task<IActionResult> EmailExists(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { Message = "Email cannot be empty." });
            }

            try
            {

                var currentUser = await _userManager.GetUserAsync(User);
                if (currentUser == null)
                {
                    return Unauthorized(new { Message = "Unauthorized request. User not found." });
                }
                var user = await _userManager.FindByEmailAsync(email);
                if (user != null)
                {
                    var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

                    if (isAdmin)
                    {
                        return Ok(new { Exists = true, IsAdmin = true, Message = "Admin email already exists." });
                    }

                    return Ok(new { Exists = true, IsAdmin = false, Message = "Email already exists." });
                }

                return Ok(new { Exists = false, Message = "Email does not exist." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Error = ex.Message });
            }
        }
        [Authorize]
        [HttpPut("~/api/User-Update")]
        public async Task<IActionResult> UpdateClientPanel([FromBody] UpdateViewModel update)
        {
            var aspNetUser = _userManager.GetUserId(User);

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Message = "Invalid data provided.", Errors = ModelState });
                }
                var result = await _accountService.UpdateClientPanel(update, aspNetUser, update.Id);

                if (result)
                {
                    return Ok(new { Message = "User updated successfully." });
                }
                else
                {
                    return NotFound(new { Message = "User not found or could not be updated." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while processing your request.",
                    Error = ex.Message
                });
            }
        }


        [HttpGet("~api/userInfoById")]
        public async Task<IActionResult> GetUserInfoById(int id)
        {
            var userInfo = await _accountService.GetUserInfoById(id);

            if (userInfo == null)
            {
                return NotFound();
            }

            return Ok(userInfo);
        }


        [HttpGet("~api/loginUserInfoByUserId")]
        public async Task<IActionResult> GetUserInfoByUserId(string UserId)
        {
            var userInfo = await _accountService.GetUserInfoByUserId(UserId);

            if (userInfo == null)
            {
                return NotFound();
            }

            return Ok(userInfo);
        }




        [Authorize(Roles="Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _accountService.GetAllUsers();

            if (users == null)
            {
                return NotFound();
            }

            return Ok(users);
        }

        
        [Route("~/api/SignOut")]
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SignOut()
        {
            await _accountService.SignOut();
            return Ok();
        }
    }
}
