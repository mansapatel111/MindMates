import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function AppContent() {
  const isLoggedIn = localStorage.getItem("token");
  const navigate = useNavigate();
  const [smilestones, setsmilestones] = useState(0);


  React.useEffect(() => {
    const storedCoins = localStorage.getItem("smilestones");
    if (storedCoins) {
      setsmilestones(parseInt(storedCoins, 10));
    }

    const handleStorageChange = () => {
      const updatedCoins = localStorage.getItem("smilestones");
      if (updatedCoins) {
        setsmilestones(parseInt(updatedCoins, 10));
      }
    };
  
    window.addEventListener("storage", handleStorageChange);


  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // React-style redirect
  };

  return (
    <div className ="App">
      <h1>Welcome to Mindmates!</h1>
      <nav>
        {!isLoggedIn ? (
          <>
            <Link to="/">Login</Link> | <Link to="/register">Register</Link>
          </>
        ) : (
          <>
          <span className="coin-display">
            {smilestones || 0} SmileStones
          </span>
            {/* <Link to="/dashboard">Dashboard</Link> |  */}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;