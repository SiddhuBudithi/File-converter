// src/components/Upload.jsx
import React, { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/files/upload", formData);
      setMessage(response.data.message);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 mt-2 rounded"
      >
        Upload
      </button>
      {message && <p className="mt-2 text-red-600">{message}</p>}
    </div>
  );
}

export default Upload;
