using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Core.DTOs;
using TaskFlow.Core.Interfaces;

namespace TaskFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var user = await _authService.RegisterUserAsync(dto.Email, dto.Password);
            if (user == null) return BadRequest("Email is already registered.");

            return Ok(new { message = "Registaration successful" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var token = await _authService.LoginUserAsync(dto.Email, dto.Password);

            if (token == null) return Unauthorized("Invalid email or password");

            var isProduction = builder.Environment.IsProduction();

            var cookieOption = new CookieOptions
            {
                HttpOnly = true,
                Secure = isProduction,
                SameSite = isProduction ? SameSiteMode.None : SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddDays(7),
                Path = "/"
            };

            Response.Cookies.Append("taskflow_session", token, cookieOption);


            return Ok(new { message = "Authentication successfully"});
        }

        [HttpPost("logout")]

        public async Task<IActionResult> Logout()
        {
            Response.Cookies.Delete("taskflow_session");
            return Ok(new { message = "Logged out successfully" });
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            return Ok(new { isAuthenticated = true });
        }

    }
}
