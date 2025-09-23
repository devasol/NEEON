const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("./../controllers/userController");

// use memory storage so files are available in req.file.buffer and not saved to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

router
  .route("/")
  .get(userController.getAllUsers)
  .post(upload.single("image"), userController.createUser);

router.route("/:id").get(userController.getUser);

module.exports = router;
