import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext.js";
import Layout from "./components/Layout.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import TaskList from "./pages/TaskList.js";
import Dashboard from "./pages/Dashboard.js";

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Initializing environment...</p>
  }



  return <BrowserRouter>
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/Register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />

      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
        <Route path="/" element={<TaskList />} />
        <Route path="/analytics" element={<Dashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>;
}

export default App;