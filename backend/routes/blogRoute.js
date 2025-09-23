const express = require("express");
const multer = require("multer");

const router = express.Router();

const blogController = require("./../controllers/blogController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(upload.single("image"), blogController.createBlog);
router.route("/:id/image").get(blogController.getImage);
router.route("/:id").get(blogController.getBlog);

module.exports = router;
