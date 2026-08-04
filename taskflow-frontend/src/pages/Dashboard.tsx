import { useState, useEffect } from "react";
import { taskService } from "../services/task.service.js";
import type { TaskItem } from "../types/index.js";

export default function Dashboard() {
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const loadmetrics = async () => {
            try {
                setLoading(true);
                const data = await taskService.getAllTasks();
                setTasks(data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false)
            }
        };
        loadmetrics()
    }, [])

    if (loading) return <p style={{ textAlign: 'center', marginTop: "50px" }}>Loading anlytics dashboard...</p>
    if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</p>

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
            <h2 style={{ marginBottom: "5px" }}>Workspace Analytics</h2>
            <p style={{ color: "#666", marginTop: 0, marginBottom: "30px" }}>Real-time productivity summary metrics</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                <div style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "#fff", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.02)" }}>
                    <span style={{ fontSize: "14px", color: "#888", fontWeight: "500" }}>TOTAL ASSESSMENTS</span>
                    <h1 style={{ margin: "10px 0 0 0", fontSize: "36px", color: "#333" }}>{totalTasks}</h1>
                </div>

                <div style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "#fff", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.02)" }}>
                    <span style={{ fontSize: "14px", color: "#888", fontWeight: "500" }}>COMPLETED</span>
                    <h1 style={{ margin: "10px 0 0 0", fontSize: "36px", color: "#28a745" }}>{completedTasks}</h1>
                </div>

                <div style={{ padding: "20px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "#fff", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.02)" }}>
                    <span style={{ fontSize: "14px", color: "#888", fontWeight: "500" }}>PENDING REVIEW</span>
                    <h1 style={{ margin: "10px 0 0 0", fontSize: "36px", color: "#dc3545" }}>{pendingTasks}</h1>
                </div>
            </div>


            <div style={{ padding: "30px", border: "1px solid #e0e0e0", borderRadius: "8px", background: "#f8f9fa" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                    <h4 style={{ margin: 0, color: "#444" }}>Overall Completion Velocity</h4>
                    <span style={{ fontWeight: "bold", color: "#007bff", fontSize: "18px" }}>{completionRate}%</span>
                </div>
                <div style={{ width: "100%", height: "16px", background: "#e9ecef", borderRadius: "8px", overflow: "hidden" }}>
                    <div
                        style={{
                            width: `${completionRate}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #007bff, #00d2ff)",
                            transition: "width 0.5s ease-out"
                        }}
                    />
                </div>
            </div>
        </div>
    )


}