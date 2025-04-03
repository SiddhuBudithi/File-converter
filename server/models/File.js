const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    name: String,
    size: Number,
    type: String,
    path: String,
    starred: { type: Boolean, default: false },
    trash: { type: Boolean, default: false },
    recents: { type: Boolean, default: true },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("File", fileSchema);
