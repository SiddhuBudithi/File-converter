// src/components/ConvertFile.jsx
import React, { useState } from "react";
import axios from "axios";

const ConvertFile = () => {
  const [file, setFile] = useState(null);
  const [convertedFile, setConvertedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [conversionType, setConversionType] = useState("pdf-to-png");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/convert/${conversionType}`,
        formData,
        { responseType: "blob" } // To receive binary data
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setConvertedFile(url);
      setMessage("File converted successfully!");
    } catch (error) {
      console.error("File conversion failed:", error);
      setMessage("Conversion failed. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Convert File</h2>
      <input type="file" onChange={handleFileChange} />
      <select
        value={conversionType}
        onChange={(e) => setConversionType(e.target.value)}
        className="mt-2 p-2 border rounded"
      >
        <option value="pdf-to-png">PDF to PNG</option>
        <option value="pdf-to-word">PDF to Word</option>
        <option value="word-to-pdf">Word to PDF</option>
      </select>
      <button
        onClick={handleConvert}
        className="bg-blue-500 text-white p-2 mt-2 rounded"
      >
        Convert
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
      {convertedFile && (
        <div className="mt-4">
          <a
            href={convertedFile}
            download="converted_file"
            className="text-green-600 underline"
          >
            Download Converted File
          </a>
        </div>
      )}
    </div>
  );
};

export default ConvertFile;
