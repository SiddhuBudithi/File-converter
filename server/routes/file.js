// server/routes/file.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const sharp = require("sharp");

const router = express.Router();

// Set up file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route to upload a file
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    res.json({ message: "File uploaded successfully", file: req.file });
  } catch (error) {
    res.status(500).json({ error: "File upload failed" });
  }
});

// Route to list uploaded files
router.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.status(500).send("Cannot list files");
    res.json(files);
  });
});

// Route to download a file
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../uploads", req.params.filename);
  res.download(filePath);
});

// PDF to PNG conversion
router.post("/convert/pdf-to-png", upload.single("file"), async (req, res) => {
  const pdfPath = path.join(__dirname, "../uploads", req.file.filename);

  try {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();

    // Convert each page to PNG
    const outputPaths = [];
    for (let i = 0; i < pageCount; i++) {
      const page = await pdfDoc.getPage(i);
      const pngBuffer = await sharp(Buffer.from(await page.save())).png().toBuffer();

      const outputPath = `converted/${req.file.filename}-page${i + 1}.png`;
      fs.writeFileSync(outputPath, pngBuffer);
      outputPaths.push(outputPath);
    }

    res.json({ message: "PDF converted to PNG successfully", files: outputPaths });
  } catch (error) {
    res.status(500).send("Conversion failed");
  }
});

// PDF to Word conversion (dummy implementation)
router.post("/convert/pdf-to-word", upload.single("file"), (req, res) => {
  const pdfPath = path.join(__dirname, "../uploads", req.file.filename);
  const outputPath = `converted/${req.file.filename}.docx`;

  // For simplicity, just copying the PDF as a dummy Word file
  try {
    fs.copyFileSync(pdfPath, outputPath);
    res.download(outputPath);
  } catch (error) {
    res.status(500).send("Conversion failed");
  }
});

// Word to PDF conversion (dummy implementation)
router.post("/convert/word-to-pdf", upload.single("file"), (req, res) => {
  const wordPath = path.join(__dirname, "../uploads", req.file.filename);
  const outputPath = `converted/${req.file.filename}.pdf`;

  // For simplicity, just copying the Word file as a dummy PDF file
  try {
    fs.copyFileSync(wordPath, outputPath);
    res.download(outputPath);
  } catch (error) {
    res.status(500).send("Conversion failed");
  }
});

module.exports = router;
