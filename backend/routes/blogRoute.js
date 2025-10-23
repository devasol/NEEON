const express = require("express");
const multer = require("multer");

const router = express.Router();

const blogController = require("./../controllers/blogController");
const authController = require("./../controllers/authController");

// use memory storage so files are available in req.file.buffer and not saved to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public route for limited posts (no auth required) - must be before all other routes
router.get("/public", blogController.getPublicBlogs);

router
  .route("/")
  .get(authController.protect, blogController.getAllBlogs)
  .post(upload.single("image"), blogController.createBlog);

router.route("/:id/image").get(blogController.getImage);
router
  .route("/:id")
  .get(blogController.getBlog)
  // allow image upload on patch as well (multer memoryStorage)
  .patch(upload.single("image"), blogController.updateBlog)
  .delete(blogController.deleteBlog);

// interactions
router.post("/:id/like", authController.protect, blogController.likeBlog);
router.post("/:id/comment", authController.protect, blogController.addComment);
router.get("/:id/comments", blogController.getComments);

module.exports = router;
