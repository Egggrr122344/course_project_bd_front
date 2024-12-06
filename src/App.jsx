import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import Register from "./component/Register.jsx";
import Auth from "./component/Auth.jsx";
import Dashboard from "./component/Dashboard.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        console.log("В App ид: " + storedUserId)
        const storedRole = localStorage.getItem("role");
        console.log("А App роль " + storedRole)

        if (storedUserId && storedRole) {
            console.log("сетим auth в true")
            setUserId(storedUserId);
            setRole(storedRole);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setRole(null);
        setUserId(null);
        navigate("/auth");
    };

    return (
        <div>
            {location.pathname !== "/dashboard" && (
                <nav>
                    <button onClick={() => navigate("/register")}>Регистрация</button>
                    <button onClick={() => navigate("/auth")}>Авторизация</button>
                </nav>
            )}

            {location.pathname === "/dashboard" && <button onClick={handleLogout}>Выйти</button>}

            <Routes>
                <Route
                    path="/"
                    element={<Auth onAuth={setIsAuthenticated} setRole={setRole} setUserId={setUserId} />}
                />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/auth"
                    element={<Auth onAuth={setIsAuthenticated} setRole={setRole} setUserId={setUserId} />}
                />
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? <Dashboard role={role} userId={userId} /> : <Navigate to="/auth" />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
