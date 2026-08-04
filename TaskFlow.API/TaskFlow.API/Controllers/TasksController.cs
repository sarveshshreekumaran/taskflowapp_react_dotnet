using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskFlow.API;
using TaskFlow.Core;
using TaskFlow.Core.Interfaces;
using TaskFlow.Data;
using Microsoft.AspNetCore.Authorization;

namespace TaskFlow.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        public readonly ITaskService _taskService;

        // Constructor Dependency Injection (DI)
        // Kestrel automatically provides the Scoped DbContext instance here!
        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // 1. GET ALL TASKS (Asynchronous + Non-Tracking Optimization)
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            // .AsNoTracking() tells EF Core not to waste memory tracking changes
            // because this is a read-only request. Great for dashboard performance!
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        // 2. CREATE A TASK
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem newTask)
        {
            if (newTask == null)
            {
                return BadRequest("Task data cannot be empty.");
            }

            var  createdTask = await _taskService.CreateTaskAsync(newTask);

            return CreatedAtAction(nameof(GetAllTasks), new { id = createdTask.Id }, createdTask);
        }

        // 3. UPDATE A TASK
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
        {
            if (updatedTask == null) return BadRequest("Update data cannot be empty");

            var result = await _taskService.UpdateTaskAsync(id, updatedTask);
            if (result == null) return NotFound($"Task with ID {id} not found.");

            return NoContent(); // 204 status: operation succeeded, no payload response needed
        }

        //4. DELETE A TASK
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var checksOut = await _taskService.DeleteTaskAsync(id);
            if (!checksOut) return NotFound($"Task with ID {id} not found.");
            return NoContent();
        } 
    }
}
