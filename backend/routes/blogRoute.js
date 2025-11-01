const express = require("express");
const multer = require("multer");

const router = express.Router();

const blogController = require("./../controllers/blogController");
const authController = require("./../controllers/authController");


const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get("/public", blogController.getPublicBlogs);

router
  .route("/")
  .get(authController.protect, blogController.getAllBlogs)
  .post(upload.single("image"), blogController.createBlog);

router.route("/:id/image").get(blogController.getImage);

router.get("/all-comments", authController.protect, blogController.getAllComments);

router
  .route("/:id")
  .get(blogController.getBlog)
  
  .patch(upload.single("image"), blogController.updateBlog)
  .delete(blogController.deleteBlog);


router.post("/:id/like", authController.protect, blogController.likeBlog);
router.post("/:id/comment", authController.protect, blogController.addComment);
router.get("/:id/comments", blogController.getComments);
router.delete("/:blogId/comments/:commentId", authController.protect, blogController.deleteComment);

module.exports = router;
