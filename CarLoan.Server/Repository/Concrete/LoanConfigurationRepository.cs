
using CarLoan.Server.DbContext;
using CarLoan.Server.Models;
using CarLoan.Server.Repository.Abstract;
using CarLoan.Server.ViewModel;
using Microsoft.EntityFrameworkCore;

public class LoanConfigurationRepository : ILoanConfigurationRepository
{
    private readonly LoansDbContext _context;
   // private readonly ILoanConfigurationServices _configurationServices;  

    public LoanConfigurationRepository(LoansDbContext context)
    {
        _context = context;
       // _configurationServices = configurationServices;
    }

    public async Task<LoanConfiguration> GetLoanConfigurationAsync()
    {
        return await _context.LoanConfigurations.FirstOrDefaultAsync();
    }

    public async Task<LoanConfiguration> UpdateLoanConfigurationAsync(LoanConfigurationViewModel configuration)
    {
        var existingConfig = await _context.LoanConfigurations.FirstOrDefaultAsync(x=>x.Id == configuration.Id);
        if (existingConfig != null)
        {
            existingConfig.MaxLoanAmount = configuration.MaxLoanAmount;
            existingConfig.MinLoanAmount = configuration.MinLoanAmount;
            existingConfig.MinRateOfInterest = configuration.MinRateOfInterest;
            existingConfig.MaxRateOfInterest = configuration.MaxRateOfInterest;
            existingConfig.MinLoanTenure = configuration.MinLoanTenure;
            existingConfig.MaxLoanTenure = configuration.MaxLoanTenure;

            _context.LoanConfigurations.Update(existingConfig);
            await _context.SaveChangesAsync();
            return existingConfig;
        }
        return null;
    }

    public async Task InitializeDefaultLoanConfigurationAsync()
    {
        if (!await _context.LoanConfigurations.AnyAsync())
        {
            var w = "633cae34-076f-443c-952c-8ba2a938242d";
            var data = new LoanConfiguration();
            data.MaxLoanAmount = 10000;
            data.MaxLoanAmount = 1000000;
            data.MinRateOfInterest = 2.3;
            data.MaxRateOfInterest = 10.2;
            data.MinLoanTenure = 10;
            data.MaxLoanTenure = 10;
            data.AspNetUserId = w;
            data.CreatedDate = DateTime.Now;
            data.CreatedUserId=w;
            data.ModifiedDate = DateTime.Now;
            data.ModifiedUserId=w;
            data.IsActive = true;

            _context.LoanConfigurations.Add(data);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<LoanCalculationResponse> CalculateLoanDetails(LoanCalculator request)
    {

        var config = await _context.LoanConfigurations.FirstOrDefaultAsync();
        //if (request.PrincipalAmount < config.MinLoanAmount || (decimal)request.PrincipalAmount < config.MaxLoanAmount)
        //{
        //    throw new ArgumentException($"Principal amount must be between {config.MinLoanAmount} and {config.MaxLoanAmount}.");
        //}


        if (request.AnnualRate < config.MinRateOfInterest || request.AnnualRate > config.MaxRateOfInterest)
        {
            throw new ArgumentException($"Annual rate must be between {config.MinRateOfInterest}% and {config.MaxRateOfInterest}%.");
        }

        if (request.TermInMonths < config.MinLoanTenure || request.TermInMonths > config.MaxLoanTenure)
        {
            throw new ArgumentException($"Term in months must be between {config.MinLoanTenure} and {config.MinLoanTenure} months.");
        }

        double principal = request.PrincipalAmount;
        double rate = request.AnnualRate / 100 / 12;
        int months = request.TermInMonths;

        if (rate == 0)
        {
            double Emi = principal / months;
            double TotalAmount = principal;
            double TotalInterest = 0;

            return new LoanCalculationResponse
            {
                EMI = Math.Round(Emi, 2),
                PrincipalAmount = principal,
                TotalInterest = Math.Round(TotalInterest, 2),
                TotalAmount = Math.Round(TotalAmount, 2)
            };
        }

        double emi = principal * rate * Math.Pow(1 + rate, months) / (Math.Pow(1 + rate, months) - 1);
        double totalAmount = emi * months;
        double totalInterest = totalAmount - principal;

        return new LoanCalculationResponse
        {
            EMI = Math.Round(emi, 2),
            PrincipalAmount = principal,
            TotalInterest = Math.Round(totalInterest, 2),
            TotalAmount = Math.Round(totalAmount, 2)
        };
    }

    public async Task<LoanConfiguration> GetLoanConfigurationById(int id)
    {
        return await _context.LoanConfigurations.FirstOrDefaultAsync(a=>a.Id==id);
    }
}
