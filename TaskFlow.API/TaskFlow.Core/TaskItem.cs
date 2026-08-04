namespace TaskFlow.Core
{
    public class TaskItem
    {
        // 1. Primary Key
        public int Id { get; set; }

        // 2. Core Properties
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? DueDate { get; set; }
    }
}
