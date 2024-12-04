namespace CarLoan.Server.ViewModel
{
    public class LoanParameters
    {
        public decimal MinLoanAmount { get; set; }
        public decimal MaxLoanAmount { get; set; }
        public double MinRateOfInterest { get; set; }
        public double MaxRateOfInterest { get; set; }
        public int MinLoanTenure { get; set; }
        public int MaxLoanTenure { get; set; }
    }

    public class LoanCalculator
    {
        public double PrincipalAmount { get; set; }
        public double AnnualRate { get; set; }
        public int TermInMonths { get; set; }
    }

    public class LoanCalculationResponse
    {
        public double EMI { get; set; }
        public double PrincipalAmount { get; set; }
        public double TotalInterest { get; set; }
        public double TotalAmount { get; set; }
    }
}
