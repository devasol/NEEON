const userModel = require("./../models/userModel");
const path = require("path");
const fs = require("fs");
//Get All Blogs
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find().select("-image");
    res.status(200).json({
      status: "success",
      message: "Successfully got all Blogs.",
      users: {
        allUsers,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Can't Get All Users!",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    let imageValue = null;
    if (req.file) {
      // If multer memoryStorage is used, file.buffer will be present
      if (req.file.buffer) {
        imageValue = { data: req.file.buffer, contentType: req.file.mimetype };
      } else if (req.file.path) {
        // disk storage - read file into buffer
        const filePath = path.join(__dirname, "..", req.file.path);
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          imageValue = { data: fileBuffer, contentType: req.file.mimetype };
        }
      }
    }

    // fallback: accept base64 image string in req.body.image
    if (!imageValue && req.body && req.body.image) {
      const imgStr = req.body.image;
      // data:[<mediatype>][;base64],<data>
      const matches = imgStr.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const contentType = matches[1];
        const data = Buffer.from(matches[2], "base64");
        imageValue = { data, contentType };
      } else {
        // assume plain base64 without data URI
        try {
          const data = Buffer.from(imgStr, "base64");
          imageValue = { data, contentType: "application/octet-stream" };
        } catch (e) {
          // ignore invalid base64
        }
      }
    }

    const newUser = await userModel.create({
      ...req.body,
      image: imageValue,
    });

    // remove binary image before sending response
    const userResponse = newUser.toObject();
    if (userResponse.image) delete userResponse.image;

    res.status(200).json({
      status: "success",
      message: "User created successfully",
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
// //Get a User
exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id).select("-image");

    res.status(200).json({
      status: "success",
      message: "Successfully got a Blog.",
      user: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Can't Get Blog! ${err}`,
    });
  }
};
// //Updating a Blog
// exports.updateBlog = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const body = req.body;
//     const updatedBlog = await BlogNewsModel.findOneAndUpdate(
//       { _id: id },
//       { $set: body },
//       { new: true, runValidators: true }
//     ).select("-image");
//     res.status(200).json({
//       status: "success",
//       message: "Blog updated successfully.",
//       blog: {
//         updatedBlog,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: `Can't Update Blog! ${err}`,
//     });
//   }
// };

// //Deleting a Blog
// exports.deleteBlog = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deletedBlog = await BlogNewsModel.findOneAndDelete({
//       _id: id,
//     }).select("-image");

//     res.status(200).json({
//       status: "success",
//       message: "Blog deleted successfully.",
//       blog: {
//         deletedBlog,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: `Can't Update Blog! ${err}`,
//     });
//   }
// };
// exports.getImage = async (req, res) => {
//   try {
//     const blog = await BlogNewsModel.findById(req.params.id);

//     if (!blog || !blog.image) {
//       return res.status(404).send("Image not found");
//     }

//     // If image stored in MongoDB as { data: Buffer, contentType: String }
//     if (blog.image.data) {
//       // blog.image.data may already be a Buffer or a plain object when serialized
//       let buffer;
//       if (Buffer.isBuffer(blog.image.data)) {
//         buffer = blog.image.data;
//       } else if (Array.isArray(blog.image.data)) {
//         buffer = Buffer.from(blog.image.data);
//       } else if (blog.image.data.data && Array.isArray(blog.image.data.data)) {
//         // sometimes it's { data: { type: 'Buffer', data: [...] } }
//         buffer = Buffer.from(blog.image.data.data);
//       }

//       if (buffer) {
//         const contentType =
//           blog.image.contentType || "application/octet-stream";
//         res.set("Content-Type", contentType);
//         return res.send(buffer);
//       }
//     }

//     // If image stored as a path string (e.g. 'uploads/xxx.jpg')
//     if (typeof blog.image === "string") {
//       const imagePath = path.join(__dirname, "..", blog.image);
//       if (!fs.existsSync(imagePath)) {
//         return res.status(404).send("Image file missing");
//       }
//       return res.sendFile(imagePath);
//     }

//     // Fallback: not a recognized format
//     return res.status(404).send("Image not available");
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
