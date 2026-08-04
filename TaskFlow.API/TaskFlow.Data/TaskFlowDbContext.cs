using Microsoft.EntityFrameworkCore;
using TaskFlow.Core;

namespace TaskFlow.Data
{
    public class TaskFlowDbContext : DbContext
    {
        // The constructor passes connection options from the API layer down into EF Core
        public TaskFlowDbContext(DbContextOptions<TaskFlowDbContext> options) : base(options) { }

        // This property tells EF Core to generate a table named "Tasks" based on our TaskItem entity
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
