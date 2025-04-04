const express = require("express");
const {
  upload,
  uploadFiles,
  getAllFiles,
  downloadFile,
  moveToTrash,
  toggleStar,
  deleteFile,
  convertFile,
  viewFile,
} = require("../controllers/fileController");

const router = express.Router();

router.post("/upload", upload.array("files"), uploadFiles);
router.get("/", getAllFiles);
router.get("/download/:filename", downloadFile);
router.patch("/:id/trash", moveToTrash);
router.patch("/:id/star", toggleStar);
router.delete("/:id", deleteFile);
router.get("/view/:filename", viewFile);
// router.post("/convert/:conversionType", convertFile);
router.post("/convert/:conversionType", upload.single("file"), convertFile);

module.exports = router;
 