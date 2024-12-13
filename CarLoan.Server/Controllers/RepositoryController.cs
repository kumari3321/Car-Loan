using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.Services.Abstract;
using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;

namespace CarLoan.Server.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IRegistrationRepository _registrationRepository;
        private readonly IRegistrationServices _registeredServices;

        public AuthController(IRegistrationRepository registrationRepository, IRegistrationServices registeredServices)
        {
            _registrationRepository = registrationRepository;
            _registeredServices = registeredServices;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Registeration([FromBody] RegistrationViewModel registrationView)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try { 
              
                var result = await _registeredServices.Registration(registrationView);

                if (result)
                {
                    return Ok("Registration successful.");
                }
                else
                {
                    return BadRequest("Registration failed.");
                }
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        //[HttpPost("upload-profile-photo")]
        //public async Task<IActionResult> UploadProfilePhoto([FromForm] ImageUploadViewModel viewModel)
        //{
        //    if (viewModel == null || viewModel.ProfilePhotoPath == null)
        //    {
        //        return BadRequest(new { Message = "No image file provided" });
        //    }

        //    try
        //    {
        //        var filePath = await _registrationRepository.UploadProfilePhotoAsync(viewModel);
        //        return Ok(new { Message = "Profile photo uploaded successfully", FilePath = filePath });
        //    }
        //    catch (ApplicationException ex)
        //    {
        //        return StatusCode(500, new { Message = "Error while uploading profile photo", Error = ex.Message });
        //    }
        //}

    }

}
