import React from "react";
import "./FileCard.css";

const FileCard = ({
  file,
  viewMode,
  onDownload,
  onDelete,
  onRestore,
  onPermanentDelete,
  onToggleStar,
}) => {
  const getFileIcon = (entry) => {
    if (entry.type === "folder") {
      return "https://cdn-icons-png.flaticon.com/512/716/716784.png";
    }

    const ext = entry.name.split(".").pop().toLowerCase();

    if (ext === "pdf") return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    if (["doc", "docx"].includes(ext)) return "https://cdn-icons-png.flaticon.com/512/337/337932.png";
    if (["xls", "xlsx"].includes(ext)) return "https://cdn-icons-png.flaticon.com/512/337/337959.png";
    if (["ppt", "pptx"].includes(ext)) return "https://cdn-icons-png.flaticon.com/512/337/337948.png";
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "https://cdn-icons-png.flaticon.com/512/337/337940.png";
    if (["mp3", "wav"].includes(ext)) return "https://cdn-icons-png.flaticon.com/512/337/337953.png";
    if (["txt", "log", "md"].includes(ext)) return "https://cdn-icons-png.flaticon.com/512/337/337956.png";

    return "https://cdn-icons-png.flaticon.com/512/337/337947.png";
  };

  return (
    <div className="file-card" onClick={() => viewMode !== "trash" && onDownload(file)}>
      <img src={getFileIcon(file)} alt="file icon" />
      <p className="file-name">{file.name}</p>
      <p className="file-size">
        {file.type === "folder" ? "Folder" : `${(file.size / 1024).toFixed(2)} KB`}
      </p>

      <div className="card-actions" onClick={(event) => event.stopPropagation()}>
        {viewMode !== "trash" && (
          <button className="action-btn star-btn" onClick={() => onToggleStar(file.id)}>
            {file.starred ? "⭐" : "☆"}
          </button>
        )}

        {viewMode === "trash" ? (
          <>
            <button className="action-btn restore-btn" onClick={() => onRestore(file.id)}>
              ♻️ Restore
            </button>
            <button className="action-btn permanent-btn" onClick={() => onPermanentDelete(file.id, file.name)}>
              ❌ Delete forever
            </button>
          </>
        ) : (
          <button className="action-btn delete-btn" onClick={() => onDelete(file.id, file.name)}>
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default FileCard;
