using System.ComponentModel.DataAnnotations;

namespace CarLoan.Server.ViewModel
{
    public class UpdateViewModel
    {
        public int Id { get; set; }
        [Required]
        public string UserName { get; set; }
       // public string UserId { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        //public IFormFile ProfilePhoto { get; set; }
        public string ProfilePhoto { get; set; }
        public string Extension { get; set; }
    }
}
