import React from "react";
import { FolderOpen, Star, Trash, Clock, Upload, Repeat, LogOut } from "lucide-react";
import "../CSS/Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onSelect, onFileUpload }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to homepage after logout
  };
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li onClick={() => onSelect("myDrive")}>
          <FolderOpen className="icon" /> My Drive
        </li>
        <li onClick={() => onSelect("recents")}>
          <Clock className="icon" /> Recents
        </li>
        <li onClick={() => onSelect("starred")}>
          <Star className="icon" /> Starred
        </li>
        <li onClick={() => onSelect("trash")}>
          <Trash className="icon" /> Trash
        </li>
        <li>
          <label htmlFor="file-upload" className="custom-button">
            <Upload className="icon" /> Upload Files
          </label>
          <input
            type="file"
            multiple
            onChange={onFileUpload}
            className="file-upload"
            id="file-upload"
            style={{ display: "none" }}
          />
        </li>
        {/* Convert File Button */}
        <li onClick={() => onSelect("convert")}>
          <Repeat className="icon" /> Convert File
        </li>
        <li onClick={handleLogout} className="logout-option">
          {" "}
          <LogOut className="icon" /> Logout{" "}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
