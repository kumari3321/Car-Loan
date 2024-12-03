using System.ComponentModel.DataAnnotations;

namespace CarLoan.Server.Models
{
    public class Users : BaseDbModel
    {
        public int Id { get; set; }

        public string UserName { get; set; }
        public string Address { get; set; }
        public string ProfilePhoto { get; set; }
        // [DeleteBehavior(DeleteBehavior.ClientCascade)]
        public ApplicationUser AspNetUser { get; set; }
        [MaxLength(450)]
        [Required]
        public string AspNetUserId { get; set; }
    }
}
