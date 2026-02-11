import React, { useRef } from "react";
import "./Sidebar.css";

const sidebarItems = [
  { id: "home", label: "🏠 Home" },
  { id: "my-drive", label: "📁 My Drive" },
  { id: "computers", label: "💻 Computers" },
  { id: "shared", label: "👥 Shared with me" },
  { id: "recent", label: "🕒 Recent" },
  { id: "starred", label: "⭐ Starred" },
  { id: "trash", label: "🗑️ Trash" },
  { id: "storage", label: "☁️ Storage" },
];

function Sidebar({ onFileSelect, onCreateFolder, onSectionSelect, activeSection }) {
function Sidebar({ onFileSelect, onSectionSelect, activeSection }) {
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
      event.target.value = "";
    }
  };

  return (
    <div className="sidebar">
      <button className="new-btn" onClick={handleClick}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/992/992651.png"
          alt="New"
          width="20"
          style={{ marginRight: "8px" }}
        />
        Upload File
      </button>

      <button className="new-btn folder-btn" onClick={onCreateFolder}>
        📂 New Folder
        New
      </button>

      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <ul>
        {sidebarItems.map((item) => (
          <li
            key={item.id}
            className={activeSection === item.id ? "active" : ""}
            onClick={() => onSectionSelect(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
