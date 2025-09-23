const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const blogNewsSchema = new mongoose.Schema({
  newsTitle: {
    type: String,
    required: [true, "New Title is Required!"],
  },
  newsDescription: {
    type: String,
    required: [true, "News Description is Required!"],
  },
  postedBy: {
    type: String,
    // required:[true,""]
    default: "Admin",
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: {
      data: Buffer,
      contentType: String,
    },
    select: false,
  },
});

const BlogNewsModel = mongoose.model("Blog", blogNewsSchema);
module.exports = BlogNewsModel;
