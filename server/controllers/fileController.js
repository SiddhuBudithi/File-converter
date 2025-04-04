const multer = require("multer");
const path = require("path");
const File = require("../models/File");
const mammoth = require("mammoth");
const pdfkit = require("pdfkit");
const pdf = require("html-pdf");
const fs = require("fs");

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
  try {
    const { conversionType } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const inputPath = path.join(__dirname, "../uploads", file.filename);
    const outputPath = path.join(
      __dirname,
      "../uploads",
      `converted_${file.filename}`
    );

    switch (conversionType) {
      case "pdf-to-png":
        return res
          .status(400)
          .json({ message: "PDF to PNG conversion not supported." });

      case "pdf-to-word":
        try {
          const arrayBuffer = fs.readFileSync(inputPath);
          const result = await mammoth.convertToHtml({ buffer: arrayBuffer });
          const wordFilePath = `${outputPath}.docx`;
          fs.writeFileSync(wordFilePath, result.value);
          return res.download(wordFilePath);
        } catch (err) {
          console.error("PDF to Word conversion failed:", err);
          return res
            .status(500)
            .json({
              message: "PDF to Word conversion failed",
              error: err.message,
            });
        }

      case "word-to-pdf":
        try {
          const wordContent = fs.readFileSync(inputPath, "utf8");
          const pdfDoc = new pdfkit();
          const pdfFilePath = `${outputPath}.pdf`;
          pdfDoc.text(wordContent);
          pdfDoc.pipe(fs.createWriteStream(pdfFilePath)).on("finish", () => {
            return res.download(pdfFilePath);
          });
          pdfDoc.end();
        } catch (err) {
          console.error("Word to PDF conversion failed:", err);
          return res
            .status(500)
            .json({
              message: "Word to PDF conversion failed",
              error: err.message,
            });
        }
        break;

      case "html-to-pdf":
        try {
          const htmlContent = fs.readFileSync(inputPath, "utf8");
          const pdfFilePath = `${outputPath}.pdf`;
          pdf.create(htmlContent).toFile(pdfFilePath, (err) => {
            if (err) {
              console.error("HTML to PDF conversion failed:", err);
              return res
                .status(500)
                .json({
                  message: "HTML to PDF conversion failed",
                  error: err.message,
                });
            }
            return res.download(pdfFilePath);
          });
        } catch (err) {
          console.error("HTML to PDF conversion failed:", err);
          return res
            .status(500)
            .json({
              message: "HTML to PDF conversion failed",
              error: err.message,
            });
        }
        break;

      default:
        return res.status(400).json({ message: "Unsupported conversion type" });
    }
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ message: "Conversion error", error: error.message });
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
