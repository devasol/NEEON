const express = require("express");
const multer = require("multer");

const router = express.Router();

const blogController = require("./../controllers/blogController");

// use memory storage so files are available in req.file.buffer and not saved to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(upload.single("image"), blogController.createBlog);
router.route("/:id/image").get(blogController.getImage);
router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;
