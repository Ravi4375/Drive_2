import React, { useMemo, useState } from "react";
import DriveApp from "./DriveApp";
import LoginPage from "./component/LoginPage";

function App() {
  const initialAuth = useMemo(() => localStorage.getItem("drive-auth") === "true", []);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("drive-auth");
    localStorage.removeItem("drive-user");
    setIsAuthenticated(false);
  };

  return <div className="App">{isAuthenticated ? <DriveApp onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}</div>;
}

export default App;
