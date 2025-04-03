import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar/Sidebar";
import ConvertFile from "./ConvertFile/ConvertFile";
import { Download, Trash, Star } from "lucide-react";
import "./CSS/Dashboard.css";
import "./CSS/FileList.css"

// Format file size for display
const formatFileSize = (size) => {
  if (size < 1024) return `${size} B`;
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  else if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("myDrive");
  const [fileStructure, setFileStructure] = useState({
    myDrive: [],
    starred: [],
    trash: [],
    recents: [],
  });

  // Fetch files from the server
  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/files");
      const files = response.data;

      setFileStructure({
        myDrive: files.filter((file) => !file.trashed),
        starred: files.filter((file) => file.starred),
        trash: files.filter((file) => file.trashed),
        recents: files.slice(0, 10),
      });
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

   // Handle file upload
   const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/files/upload`,
        formData
    );    
      alert(response.data.message);
      fetchFiles();
    } catch (error) {
      console.error("File upload failed:", error);
    }

    event.target.value = null;
  };

  // Move file to trash
  const handleDelete = async (fileId) => {
    try {
      await axios.patch(`http://localhost:5000/api/files/${fileId}/trash`);
      alert("File moved to trash");
      fetchFiles();
    } catch (error) {
      console.error("Error moving file to trash:", error);
    }
  };

   // Toggle star/unstar a file
   const handleStar = async (fileId) => {
    try {
      await axios.patch(`http://localhost:5000/api/files/${fileId}/star`);
      alert("File starred/unstarred");
      fetchFiles();
    } catch (error) {
      console.error("Error starring/un-starring file:", error);
    }
  };

   // Download file
   const handleDownload = async (file) => {
    try {
      const response = await axios.get(file.path, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("File download failed:", error);
    }
  };

  
   // Render file list
   const renderFileList = (files, section) => (
    <div className="filelist-container">
      <table className="filelist-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Last Modified</th>
            <th>File Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.length > 0 ? (
            files.map((file, index) => (
              <tr key={index}>
                <td>{file.name}</td>
                <td>{section}</td>
                <td>{new Date(file.uploadDate).toLocaleDateString()}</td>
                <td>{formatFileSize(file.size)}</td>
                <td>
                  <button onClick={() => handleDownload(file)}>
                    <Download className="icon" />
                  </button>
                  <button>
                    <Star className="icon" />
                  </button>
                  <button>
                    <Trash className="icon" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="empty-folder">
                No files in {section}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

 // Permanently delete a file from trash
  const handlePermanentDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${fileId}`);
      alert("File permanently deleted");
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file permanently:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar onSelect={setActiveSection} onFileUpload={handleFileUpload} />
      <div className="homepage">
        <h1 className="homepage-title">
          {activeSection.replace(/([A-Z])/g, " $1").trim()}
        </h1>

        {/* Render file lists based on the selected section */}
        {activeSection === "myDrive" &&
          renderFileList(fileStructure.myDrive, "My Drive")}
        {activeSection === "starred" &&
          renderFileList(fileStructure.starred, "Starred")}
        {activeSection === "trash" &&
          renderFileList(fileStructure.trash, "Trash")}
        {activeSection === "recents" &&
          renderFileList(fileStructure.recents, "Recents")}

         {/* Render ConvertFile Component */}
         {activeSection === "convert" && (
                <div className="convert-file-section">
                    <ConvertFile files={fileStructure.myDrive} />
                </div>
            )}
      </div>
    </div>
  );
};

export default Dashboard;
