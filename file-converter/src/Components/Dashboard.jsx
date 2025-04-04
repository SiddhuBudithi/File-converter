import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConvertFile from "./ConvertFile/ConvertFile";
import { Download, Trash, Star } from "lucide-react";
import "./CSS/Dashboard.css";
import "./CSS/FileList.css";

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

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/files");
      const files = response.data.files;

      setFileStructure({
        myDrive: files.filter((file) => !file.trash),
        starred: files.filter((file) => file.starred && !file.trash),
        trash: files.filter((file) => file.trash),
        recents: files.filter((file) => !file.trash).slice(0, 10),
      });
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const formData = new FormData();
    uploadedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/upload`,
        formData
      );
      toast.success(response.data.message);
      fetchFiles();
    } catch (error) {
      toast.error("File upload failed");
      console.error("File upload failed:", error);
    }

    event.target.value = null;
  };

  const handleView = (file) => {
    const filename = file.path.split("\\").pop();
    const fileUrl = `http://localhost:5000/api/files/view/${filename}`;
    window.open(fileUrl, "_blank");
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.patch(`http://localhost:5000/api/files/${fileId}/trash`);
      toast.success("File moved to trash");
      fetchFiles();
    } catch (error) {
      toast.error("Error moving file to trash");
      console.error("Error moving file to trash:", error);
    }
  };

  const handleStar = async (fileId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/files/${fileId}/star`
      );
      toast.success("File starred/unstarred");
      fetchFiles();
    } catch (error) {
      toast.error("Error starring/un-starring file");
      console.error("Error starring/un-starring file:", error);
    }
  };

  const handlePermanentDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${fileId}`);
      toast.success("File permanently deleted");
      fetchFiles();
    } catch (error) {
      toast.error("Error deleting file permanently");
      console.error("Error deleting file permanently:", error);
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${file.path
          .split("\\")
          .pop()}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("File download failed");
      console.error("File download failed:", error);
    }
  };

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
                  <button onClick={() => handleView(file)}>View</button>
                  <button onClick={() => handleDownload(file)}>
                    <Download className="icon" />
                  </button>
                  <button onClick={() => handleStar(file._id)}>
                    <Star className={file.starred ? "icon starred" : "icon"} />
                  </button>
                  {section === "Trash" ? (
                    <button onClick={() => handlePermanentDelete(file._id)}>
                      <Trash className="icon delete" />
                    </button>
                  ) : (
                    <button onClick={() => handleDelete(file._id)}>
                      <Trash className="icon" />
                    </button>
                  )}
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

  return (
    <div className="dashboard-container">
      <Sidebar onSelect={setActiveSection} onFileUpload={handleFileUpload} />
      <div className="homepage">
        <h1 className="homepage-title">
          {activeSection.replace(/([A-Z])/g, " $1").trim()}
        </h1>
        {activeSection === "myDrive" &&
          renderFileList(fileStructure.myDrive, "My Drive")}
        {activeSection === "starred" &&
          renderFileList(fileStructure.starred, "Starred")}
        {activeSection === "trash" &&
          renderFileList(fileStructure.trash, "Trash")}
        {activeSection === "recents" &&
          renderFileList(fileStructure.recents, "Recents")}
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
