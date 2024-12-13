using System.ComponentModel.DataAnnotations;

namespace CarLoan.Server.ViewModel
{
    public class RegistrationViewModel
    {
        public string UserName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        
       
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Compare("Password")]
        public string ConfirmPassword { get; set; }
       // public IFormFile ProfilePhotoPath { get; set; }
        public string ProfilePhoto { get;  set; }
        public string Extension { get;  set; }
    }
}
