using System;
using System.Collections.Generic;
using System.Text;

namespace TaskFlow.Core.Interfaces
{
    public interface IAuthService
    {
        Task<User?> RegisterUserAsync(string email, string password);
        Task<string?> LoginUserAsync(string email, string password);
    }
}
