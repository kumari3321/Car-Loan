using System.ComponentModel.DataAnnotations;

namespace CarLoan.Server.Models
{
    public class LoanConfiguration : BaseDbModel
    {
        public int Id { get; set; }
        public decimal MinLoanAmount { get; set; }
        public decimal MaxLoanAmount { get; set; }
        public double MinRateOfInterest { get; set; }
        public double MaxRateOfInterest { get; set; }
        public int MinLoanTenure { get; set; }
        public int MaxLoanTenure { get; set; }
        public ApplicationUser AspNetUser { get; set; }
        [MaxLength(450)]
        [Required]
        public string AspNetUserId { get; set; }
    }
}
