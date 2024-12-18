

using CarLoan.Server.Models;
using CarLoan.Server.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class LoanConfigurationsController : ControllerBase
{
    private readonly ILoanConfigurationServices _loanConfigurationService;

    public LoanConfigurationsController(ILoanConfigurationServices loanConfigurationService)
    {
        _loanConfigurationService = loanConfigurationService;
    }
    //[Authorize(Roles = "")]

    [HttpGet]
    [Route("GetLoanConfiguration")]
    public async Task<IActionResult> GetLoanConfiguration()
    {
        await _loanConfigurationService.InitializeDefaultLoanConfigurationAsync();

        var loanConfig = await _loanConfigurationService.GetLoanConfigurationAsync();
        if (loanConfig == null)
        {
            return NotFound();
        }
        return Ok(loanConfig);
    }

   // [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("GetLoanConfigurationById")]
    public async Task<IActionResult> GetLoanConfigurationById(int id)
    {
        await _loanConfigurationService.InitializeDefaultLoanConfigurationAsync();

        var loanConfig = await _loanConfigurationService.GetLoanConfigurationById(id);
        if (loanConfig == null)
        {
            return NotFound();
        }
        return Ok(loanConfig);
    }

    [Authorize(Roles = "Admin")]

    [HttpPut]
    [Route("UpdateLoanConfiguration")]
    public async Task<IActionResult> UpdateLoanConfiguration([FromBody] LoanConfigurationViewModel configuration)
    
    {
        if (configuration == null || configuration.Id <= 0)
        {
            return BadRequest();
        }

        var updatedConfig = await _loanConfigurationService.UpdateLoanConfigurationAsync(configuration);
        if (updatedConfig == null)
        {
            return NotFound();
        }

        return Ok(updatedConfig);
    }


    [HttpPost("calculate-loan")]
    public async Task<IActionResult> CalculateLoanDetails([FromBody] LoanCalculator request)
    {
        if (request == null)
        {
            return BadRequest("Loan request cannot be null.");
        }

        try
        {
            var result = await _loanConfigurationService.CalculateLoanDetails(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
