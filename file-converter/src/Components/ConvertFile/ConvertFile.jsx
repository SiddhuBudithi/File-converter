import React, { useState } from "react";
import axios from "axios";

const ConvertFile = ({ files }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [conversionType, setConversionType] = useState("pdf-to-png");

  const handleConvert = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/convert/${selectedFile._id}`
      );
      setMessage(response.data.message);
      setConvertedFile(response.data.path);
    } catch (error) {
      console.error("Conversion failed:", error);
      setMessage("Conversion failed. Please try again.");
    }
  };

  return (
    <div className="convert-file-container">
      <h2 className="text-xl mb-2">Convert File</h2>
      <select
        value={conversionType}
        onChange={(e) => setConversionType(e.target.value)}
        className="mt-2 p-2 border rounded"
      >
        <option value="pdf-to-png">PDF to PNG</option>
        <option value="pdf-to-word">PDF to Word</option>
        <option value="word-to-pdf">Word to PDF</option>
        <option value="img-to-pdf">Image to PDF</option>
        <option value="pdf-to-img">PDF to Image</option>
      </select>
      <select
        onChange={(e) =>
          setSelectedFile(files.find((file) => file.name === e.target.value))
        }
        className="mt-2 p-2 border rounded"
      >
        <option>Select a file to convert</option>
        {files.map((file, index) => (
          <option key={index} value={file.name}>{file.name}</option>
        ))}
      </select>
      <button onClick={handleConvert} className="bg-blue-500 text-white p-2 mt-2 rounded">
        Convert
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
      {convertedFile && (
        <div className="mt-4">
          <a href={convertedFile} download className="text-green-600 underline">
            Download Converted File
          </a>
        </div>
      )}
    </div>
  );
};

export default ConvertFile;
