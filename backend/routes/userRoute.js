const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
// use memory storage so files are available in req.file.buffer and not saved to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(upload.single("image"), userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
