import React from "react";
import "./Header.css";

function Header({ onSearch, onLogout }) {
  return (
    <div className="header">
      <h2>Welcome to Drive</h2>
      <input
        type="text"
        placeholder="Search in Drive"
        onChange={(e) => onSearch(e.target.value)}
      />
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Header;
