import { useEffect, useState } from "react";
import { taskService } from "../services/task.service.js";
import TaskForm from "./TaskForm.js";
import type { TaskItem } from "../types/index.js";

export default function TaskList() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await taskService.getAllTasks();
            setTasks(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTasks()
    }, [])

    const handleToggleComplete = async (task: TaskItem) => {
        try {
            const updatedTasks = { ...task, isCompleted: !task.isCompleted };
            await taskService.updateTask(task.id, updatedTasks);

            setTasks(tasks.map((t) => t.id === task.id ? updatedTasks : t))
        } catch (error: any) {
            alert(`Failed to update task: ${error.message}`)
        }
    }

    const handleDeleteTask = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await taskService.deleteTask(id);

            setTasks(tasks.filter((t) => t.id !== id))
        } catch (error: any) {
            alert(`Failed to delete task: ${error.message}`)
        }
    }

    const handleFormSuccess = () => {
        setIsCreating(false);
        setTaskToEdit(null);
        loadTasks()
    }

    if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading tasks...</p>
    if (error) return <p style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</p>

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>

            {isCreating &&
                (<TaskForm
                    onSaveSuccess={handleFormSuccess}
                    onCancel={() => setIsCreating(false)}
                />)
            }

            {taskToEdit && (
                <TaskForm
                    existingTask={taskToEdit}
                    onSaveSuccess={handleFormSuccess}
                    onCancel={() => setTaskToEdit(null)}
                />
            )}

            {!isCreating && !taskToEdit && (
                <>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2>Your Tasks</h2>
                        <button
                          onClick={()=> setIsCreating(true)} 
                          style={{ padding: "8px 16px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                        >
                            + Add New Task
                        </button>
                    </div>

                    {tasks.length === 0 ? (
                        <p>No task found. Click "+ Add New Task" to create one!</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: "collapse", textAlign: "left" }}>
                            <thead>
                                <tr style={{ borderBottom: "2px solid #ccc" }}>
                                    <th style={{ padding: "10px" }}>Status</th>
                                    <th style={{ padding: "10px" }}>Title</th>
                                    <th style={{ padding: "10px" }}>Description</th>
                                    <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tasks.map((task) => (
                                        <tr key={task.id} style={{ borderBottom: "1px soild #eee", background: task.isCompleted ? "#f9f9f9" : "#fff" }}>
                                            <td style={{ padding: '10px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={task.isCompleted}
                                                    onChange={() => handleToggleComplete(task)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </td>
                                            <td style={{ padding: '10px', textDecoration: task.isCompleted ? "line-through" : 'none', fontWeight: 'bold' }}>
                                                {task.title}
                                            </td>
                                            <td style={{ padding: "10px", color: "#666" }}>
                                                {task.description}
                                            </td>
                                            <td style={{ padding: "10px", textAlign: "right", display:"flex", gap:"5px", justifyContent:"flex-end" }}>
                                            <button
                                                    onClick={() => setTaskToEdit(task)}
                                                    style={{ background: '#007bff', color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    style={{ background: '#dc3545', color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    )
}