using System.ComponentModel.DataAnnotations;

namespace CarLoan.Server.ViewModel
{
    public class RegistrationViewModel
    {
        public string UserName { get; set; }

        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }
        public IFormFile ProfilePhoto { get; set; }
    }
}
