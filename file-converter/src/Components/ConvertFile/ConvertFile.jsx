import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ConvertFile = ({ files }) => {
  const [selectedFileId, setSelectedFileId] = useState("");
  const [convertedFile, setConvertedFile] = useState(null);
  const [conversionType, setConversionType] = useState("pdf-to-png");

  const handleConvert = async () => {
    if (!selectedFileId) {
      toast.error("Please select a file first!");
      return;
    }

    const selectedFile = files.find((file) => file._id === selectedFileId);
    if (!selectedFile) {
      toast.error("Selected file not found!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile.path);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/convert/${conversionType}`,
        formData,
        { responseType: "blob" }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setConvertedFile(url);
        toast.success("File converted successfully!");
      } else {
        toast.error("Conversion failed. Please try again.");
      }
    } catch (error) {
      console.error("File conversion failed:", error);
      toast.error("Conversion failed. Please check the file format.");
    }
  };

  return (
    <div className="convert-file-container">
      <h2>Convert File</h2>

      <select
        value={conversionType}
        onChange={(e) => setConversionType(e.target.value)}
      >
        <option value="pdf-to-png">PDF to PNG</option>
        <option value="pdf-to-word">PDF to Word</option>
        <option value="word-to-pdf">Word to PDF</option>
        <option value="html-to-pdf">Html to PDF</option>
      </select>

      <select
        value={selectedFileId}
        onChange={(e) => setSelectedFileId(e.target.value)}
      >
        <option value="">Select a file to convert</option>
        {files.map((file) => (
          <option key={file._id} value={file._id}>
            {file.name}
          </option>
        ))}
      </select>

      <button onClick={handleConvert}>Convert</button>

      {convertedFile && (
        <div>
          <p>Conversion successful!</p>
          <a href={convertedFile} download="converted_file">
            Download Converted File
          </a>
        </div>
      )}
    </div>
  );
};

export default ConvertFile;
