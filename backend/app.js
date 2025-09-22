const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");

const app = express();

dotenv.config({ path: "./config.env" });

const storage = multer.memoryStorage();
const upload = multer({ storage });
const port = process.env.PORT || 9000;
const DB = process.env.DATABASE_URL;

mongoose
  .connect(DB)
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log("Database is not Connected", err));

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
    data: Buffer,
    contentType: String,
  },
});

const BlogNewsModel = mongoose.model("Blog", blogNewsSchema);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Successfull",
  });
});

app.post("/api/v1/blog", upload.single("image"), async (req, res) => {
  try {
    const newBlog = new BlogNewsModel({
      newsTitle: req.body.newsTitle,
      newsDescription: req.body.newsDescription,
      postedBy: req.body.postedBy || "Admin",
      datePosted: Date.now(),
      image: {
        data: req.file.buffer, // binary data
        contentType: req.file.mimetype, // jpg/png/etc.
      },
    });
    await newBlog.save();
    res.status(200).json({
      status: "success",
      message: "Blog post created successfully",
      blog: {
        _id: newBlog._id,
        newsTitle: newBlog.newsTitle,
        newsDescription: newBlog.newsDescription,
        postedBy: newBlog.postedBy,
        datePosted: newBlog.dataPosted,
        imageUrl: `/api/blog/${newBlog._id}/image`,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});

app.get("/api/v1/blog/:id/image", async (req, res) => {
  const blog = await BlogNewsModel.findById(req.params.id);
  res.contentType(blog.image.contentType);
  res.send(blog.image.data);
});

app.listen(port, () => console.log(`Server is Running on port ${port}`));
