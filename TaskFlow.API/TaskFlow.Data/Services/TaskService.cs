using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Core;
using TaskFlow.Core.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace TaskFlow.Data.Services
{
    public class TaskService : ITaskService
    {
        private readonly TaskFlowDbContext _context;

        // Inject the DbContext here instead of the controller!
        public TaskService(TaskFlowDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
        {
            // Keeping our high-performance read-only optimization intact
            return await _context.Tasks.AsNoTracking().ToListAsync();
        }

        public async Task<TaskItem> CreateTaskAsync(TaskItem task)
        {
            // This is where real business logic lives.
            // Example: Force the creation date to always be UtcNow when created
            task.CreatedAt = DateTime.UtcNow;
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<TaskItem?> UpdateTaskAsync(int id, TaskItem updatedTask)
        {
            var existingTask = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);

            if (existingTask == null)
            {
                return null;
            }

            // Explicit mapping prevents users from altering tracking attributes like Id or CreatedAt
            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.IsCompleted = updatedTask.IsCompleted;
            existingTask.DueDate = updatedTask.DueDate;

            await _context.SaveChangesAsync();
            return existingTask;
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == id);
            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }



    }
}
