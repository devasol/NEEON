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
  category: {
    type: String,
    default: "Uncategorized",
  },
  status: {
    type: String,
    default: "Draft",
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  comments: {
    type: Number,
    default: 0,
  },
  commentsList: [
    {
      text: { type: String, required: true },
      user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
      username: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  image: {
    type: {
      data: Buffer,
      contentType: String,
    },
    select: false,
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (v) {
          return /^https?:\/\/.+\..+/.test(v);
        }
        return true; // Allow null/undefined
      },
      message: 'Please provide a valid URL for the image'
    }
  },
});
// enable timestamps so createdAt is available
blogNewsSchema.set("timestamps", true);

const BlogNewsModel = mongoose.model("Blog", blogNewsSchema);
module.exports = BlogNewsModel;
