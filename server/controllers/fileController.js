const File = require("../models/File");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../../uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Upload files
const uploadFiles = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const files = req.files.map(file => ({
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

module.exports = { upload, uploadFiles, getAllFiles, convertFile };
