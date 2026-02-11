import React, { useState, useEffect } from "react";
import Sidebar from "../src/component/Sidebar";
import Header from "../src/component/Header";
import FileCard from "../src/component/FileCard";
import "./DriveApp.css";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/files";

function DriveApp({ onLogout }) {
function DriveApp() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    fetchFilesBySection(activeSection);
  }, [activeSection]);

  const fetchFilesBySection = async (section) => {
    if (section === "storage") {
      const storageRes = await axios.get(`${API_BASE_URL}/storage`);
      setStorageInfo(storageRes.data);
      setFiles([]);
      return;
    }

    const res = await axios.get(`${API_BASE_URL}/view/${section}`);
    setFiles(res.data);
    setStorageInfo(null);
  };

  const handleUploadFromSidebar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    fetchFilesBySection(activeSection);
  };

  const handleCreateFolder = async () => {
    const folderName = window.prompt("Enter folder name");
    if (!folderName || !folderName.trim()) return;

    await axios.post(`${API_BASE_URL}/folder`, {
      name: folderName.trim(),
      parentFolderId: null,
    });

    if (["home", "my-drive", "computers"].includes(activeSection)) {
      fetchFilesBySection(activeSection);
    }
  };

  const handleDownload = (file) => {
    if (file.type === "folder") {
      alert("Folder open navigation is not added yet.");
      return;
    }
    window.location.href = `${API_BASE_URL}/download/${file.id}`;
  const handleDownload = (id) => {
    window.location.href = `${API_BASE_URL}/download/${id}`;
  };

  const handleDelete = async (id, fileName) => {
    const confirmed = window.confirm(`Move "${fileName}" to trash?`);
    if (!confirmed) return;

    await axios.patch(`${API_BASE_URL}/trash/${id}`);
    fetchFilesBySection(activeSection);
  };

  const handleRestore = async (id) => {
    await axios.patch(`${API_BASE_URL}/restore/${id}`);
    fetchFilesBySection(activeSection);
  };

  const handlePermanentDelete = async (id, fileName) => {
    const confirmed = window.confirm(`Permanently delete "${fileName}"? This cannot be undone.`);
    if (!confirmed) return;

    await axios.delete(`${API_BASE_URL}/permanent-delete/${id}`);
    fetchFilesBySection(activeSection);
  };

  const handleToggleStar = async (id) => {
    await axios.patch(`${API_BASE_URL}/star/${id}/toggle`);
    fetchFilesBySection(activeSection);
  };

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const storageUsedGb = storageInfo ? (storageInfo.usedBytes / (1024 * 1024 * 1024)).toFixed(2) : 0;
  const storageTotalGb = storageInfo ? (storageInfo.maxBytes / (1024 * 1024 * 1024)).toFixed(0) : 15;
  const usedPercentage = storageInfo ? storageInfo.usedPercentage.toFixed(2) : 0;

  return (
    <div className="main-layout">
      <Sidebar
        onFileSelect={handleUploadFromSidebar}
        onCreateFolder={handleCreateFolder}
        onSectionSelect={setActiveSection}
        activeSection={activeSection}
      />
      <div className="content-area">
        <Header onSearch={setSearchTerm} onLogout={onLogout} />
        <Header onSearch={setSearchTerm} />

        {activeSection === "storage" ? (
          <div className="storage-card">
            <h2>☁️ Storage</h2>
            <p>
              {storageUsedGb} GB used of {storageTotalGb} GB
            </p>
            <div className="storage-progress">
              <div className="storage-progress-fill" style={{ width: `${usedPercentage}%` }} />
            </div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="empty-state">
            <img src="/default.svg" alt="No Files" style={{ width: "500px" }} />
            <p>No files available in this section.</p>
          </div>
        ) : (
          <div className="files-grid">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                viewMode={activeSection}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
                onToggleStar={handleToggleStar}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DriveApp;
