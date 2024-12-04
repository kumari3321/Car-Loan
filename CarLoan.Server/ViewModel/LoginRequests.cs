using System.ComponentModel.DataAnnotations;

namespace CarLoan.Server.ViewModel
{
    public class LoginRequests
    {
        [Display(Name = "Email")]
        [MaxLength(256)]
        [DataType(DataType.EmailAddress)]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }
    }
}
