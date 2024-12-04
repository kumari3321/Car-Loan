using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace CarLoan.Server.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IRegistrationRepository _registrationRepository;

        public AuthController(IRegistrationRepository registrationRepository)
        {
            _registrationRepository = registrationRepository;
        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegistrationViewModel registrationView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _registrationRepository.Registration(registrationView);
                if (result)
                {
                    return Ok("Registration successful.");
                }
                return BadRequest("Registration failed.");
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



    }

}
