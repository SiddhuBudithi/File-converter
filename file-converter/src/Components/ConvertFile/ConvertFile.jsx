import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../CSS/ConvertFile.css"

const ConvertFile = ({ files }) => {
  const [selectedFileId, setSelectedFileId] = useState("");
  const [conversionType, setConversionType] = useState("pdf-to-word");
  const [convertedFile, setConvertedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!selectedFileId) {
      toast.error("Please select a file first!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/files/convert/${conversionType}`,
        { fileId: selectedFileId },
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
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="convert-file-container">
      <h2>Convert Your File</h2>

      <label>Select Conversion Type:</label>
      <select
        value={conversionType}
        onChange={(e) => setConversionType(e.target.value)}
      >
        <option value="pdf-to-word">PDF to Word (DOCX)</option>
        <option value="word-to-pdf">Word (DOCX) to PDF</option>
      </select>

      <label>Select File to Convert:</label>
      <select
        value={selectedFileId}
        onChange={(e) => setSelectedFileId(e.target.value)}
      >
        <option value="">-- Select File --</option>
        {files.map((file) => (
          <option key={file._id} value={file._id}>
            {file.name}
          </option>
        ))}
      </select>

      <button className="converting-btn"  onClick={handleConvert} disabled={loading}>
        {loading ? "Converting..." : "Convert"}
      </button>

      {convertedFile && (
        <div style={{ marginTop: "10px" }}>
          <p>Conversion successful!</p>
          <a
            href={convertedFile}
            download={`converted_file.${
              conversionType === "pdf-to-word" ? "docx" : "pdf"
            }`}
          >
            Download Converted File
          </a>
        </div>
      )}
    </div>
  );
};

export default ConvertFile;
