const multer = require("multer");
const path = require("path");
const File = require("../models/File");
const fs = require("fs");
const mime = require("mime-types");
const axios = require("axios");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const files = req.files.map((file) => ({
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
    }));

    const savedFiles = await File.insertMany(files);
    res.json({ message: "Files uploaded successfully", files: savedFiles });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Error fetching files", error });
  }
};

const viewFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "../uploads", filename);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("File not found:", err);
        res.status(404).json({ message: "File not found" });
      }
    });
  } catch (error) {
    console.error("Error viewing file:", error);
    res.status(500).json({ message: "Error viewing file", error });
  }
};

const downloadFile = (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Download failed:", err);
      res.status(500).json({ message: "Download failed", error: err });
    }
  });
};

const moveToTrash = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    file.trash = true;
    file.starred = false;
    await file.save();
    res.json({ message: "File moved to trash" });
  } catch (error) {
    console.error("Error moving file to trash:", error);
    res.status(500).json({ message: "Error moving file to trash", error });
  }
};

const toggleStar = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    file.starred = !file.starred;
    await file.save();
    res.json({ message: "File star status toggled" });
  } catch (error) {
    console.error("Error toggling star status:", error);
    res.status(500).json({ message: "Error toggling star status", error });
  }
};

const deleteFile = async (req, res) => {
  try {
    await File.findByIdAndDelete(req.params.id);
    res.json({ message: "File permanently deleted" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Error deleting file", error });
  }
};

const convertFile = async (req, res) => {
  const { fileId } = req.body;
  const { type } = req.params;

  if (!fileId) {
    return res.status(400).json({ error: "Missing file ID." });
  }

  try {
    const file = await File.findById(fileId);
    if (!file || !fs.existsSync(file.path)) {
      return res.status(404).json({ error: "File not found or path invalid." });
    }

    const apiKey = process.env.PDFCO_API_KEY;

    const presignedUrlResponse = await axios.get(
      `https://api.pdf.co/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(
        file.path
      )}`,
      { headers: { "x-api-key": apiKey } }
    );

    if (presignedUrlResponse.data.error) {
      return res
        .status(500)
        .json({ error: "Failed to retrieve presigned URL." });
    }

    const uploadUrl = presignedUrlResponse.data.presignedUrl;

    const fileData = fs.readFileSync(file.path);
    await axios.put(uploadUrl, fileData, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    const uploadedFileUrl = presignedUrlResponse.data.url;

    let conversionUrl = "";
    if (type === "pdf-to-word") {
      conversionUrl = "https://api.pdf.co/v1/pdf/convert/to/text";
    } else if (type === "word-to-pdf") {
      conversionUrl = "https://api.pdf.co/v1/pdf/convert/from/doc";
    } else {
      return res.status(400).json({ error: "Unsupported conversion type." });
    }

    const conversionPayload = {
      name: `converted_file`,
      async: false,
      url: uploadedFileUrl,
    };

    const conversionResponse = await axios.post(
      conversionUrl,
      conversionPayload,
      {
        headers: { "x-api-key": apiKey },
      }
    );

    if (conversionResponse.data.error) {
      return res.status(500).json({ error: conversionResponse.data.message });
    }

    const convertedFileRes = await axios.get(conversionResponse.data.url, {
      responseType: "arraybuffer",
    });

    const outputExt = type === "pdf-to-word" ? ".docx" : ".pdf";

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=converted${outputExt}`
    );
    res.setHeader(
      "Content-Type",
      mime.lookup(outputExt) || "application/octet-stream"
    );

    return res.send(convertedFileRes.data);
  } catch (error) {
    console.error(
      "PDF.co conversion failed:",
      error?.response?.data || error.message
    );
    res.status(500).json({ error: "An error occurred during conversion." });
  }
};

module.exports = {
  upload,
  uploadFiles,
  getAllFiles,
  viewFile,
  downloadFile,
  moveToTrash,
  toggleStar,
  deleteFile,
  convertFile,
};
