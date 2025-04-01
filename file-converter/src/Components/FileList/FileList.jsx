// src/components/FileList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

function FileList() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/files")
      .then((response) => setFiles(response.data))
      .catch(() => setMessage("Error loading files"));
  }, []);

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${fileName}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      setMessage("File download failed. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Available Files</h2>
      {message && <p className="text-red-600">{message}</p>}
      <ul className="list-disc pl-5">
        {files.map((file) => (
          <li key={file} className="flex justify-between items-center mb-2">
            {file}
            <button
              onClick={() => handleDownload(file)}
              className="ml-2 bg-green-500 text-white p-1 rounded"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FileList;
