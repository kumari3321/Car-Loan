using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace CarLoan.Server.Models
{
    public class BaseDbModel
    {

        [MaxLength(450)]
        public string CreatedUserId { get; set; }
        [DeleteBehavior(DeleteBehavior.ClientCascade)]
        public ApplicationUser CreatedUser { get; set; }
        public DateTime CreatedDate { get; set; }
        [MaxLength(450)]
        public string? ModifiedUserId { get; set; }
        public ApplicationUser ModifiedUser { get; set; }
        public DateTime? ModifiedDate { get; set; }
        [DefaultValue("true")]
        public bool IsActive { get; set; }
    }
}
