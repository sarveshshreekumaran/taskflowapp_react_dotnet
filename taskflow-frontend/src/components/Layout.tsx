import { Link, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.js";

export default function Layout() {
    const { logoutUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    }


    return (
        <div style={{ minHeight: "100vh", background: "#f5f7fb" }}>
            <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 40px", background: "#fff", borderBottom: "1px soild #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                    <h3 style={{ margin: 0, color: '#007bff', letterSpacing: "0.5px" }}>TaskFlow</h3>
                    <Link to="/" style={{ textDecoration: "none", color: "#4a5568", fontWeight: "500" }}>Tasks</Link>
                    <Link to="/analytics" style={{ textDecoration: "none", color: "#4a5568", fontWeight: "500" }}>Dashboard</Link>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ background: "transparent", border: "1px soild #e2e8f0", padding: "6px 12px", borderRadius: "4px", color: "#e53e3e", cursor: "pointer", fontWeight: "500" }}
                >
                    Logout
                </button>
            </nav>
            <main style={{ padding: "20px" }}>
                <Outlet />
            </main>
        </div>
    )
}