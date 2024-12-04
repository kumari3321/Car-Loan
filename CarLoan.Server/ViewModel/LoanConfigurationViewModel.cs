namespace CarLoan.Server.ViewModel
{
    public class LoanConfigurationViewModel
    {
        public int Id { get; set;}
        public decimal MinLoanAmount { get; set; }
        public decimal MaxLoanAmount { get; set; }
        public double MinRateOfInterest { get; set; }
        public double MaxRateOfInterest { get; set; }
        public int MinLoanTenure { get; set; }
        public int MaxLoanTenure { get; set; }
        public bool IsActive { get; set; }
    }
}
