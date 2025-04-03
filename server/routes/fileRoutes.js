const express = require("express");
const { upload, uploadFiles, getAllFiles, convertFile } = require("../controllers/fileController");

const router = express.Router();

// Ensure the correct route and middleware for file upload
router.post("/upload", upload.array("files"), uploadFiles);
router.get("/", getAllFiles);
router.post("/convert/:id", convertFile);

module.exports = router;
