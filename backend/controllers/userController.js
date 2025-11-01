const userModel = require("./../models/userModel");
const path = require("path");
const fs = require("fs");

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find().select("-image");
    res.status(200).json({
      status: "success",
      message: "Successfully got all users.",
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
      
      if (req.file.buffer) {
        imageValue = { data: req.file.buffer, contentType: req.file.mimetype };
      } else if (req.file.path) {
        
        const filePath = path.join(__dirname, "..", req.file.path);
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          imageValue = { data: fileBuffer, contentType: req.file.mimetype };
        }
      }
    }

    
    if (!imageValue && req.body && req.body.image) {
      const imgStr = req.body.image;
      
      const matches = imgStr.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const contentType = matches[1];
        const data = Buffer.from(matches[2], "base64");
        imageValue = { data, contentType };
      } else {
        
        try {
          const data = Buffer.from(imgStr, "base64");
          imageValue = { data, contentType: "application/octet-stream" };
        } catch (e) {
          
        }
      }
    }

    const newUser = await userModel.create({
      ...req.body,
      image: imageValue,
    });

    
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

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id).select("-image");

    res.status(200).json({
      status: "success",
      message: "Successfully got a User.",
      user: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Can't Get User! ${err}`,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const updatedUser = await userModel
      .findOneAndUpdate(
        { _id: id },
        { $set: body },
        { new: true, runValidators: true }
      )
      .select("-image");
    res.status(200).json({
      status: "success",
      message: "User updated successfully.",
      user: {
        updatedUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Can't Update User! ${err}`,
    });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await userModel
      .findOneAndDelete({
        _id: id,
      })
      .select("-image");

    res.status(200).json({
      status: "success",
      message: "User deleted successfully.",
      blog: {
        deletedUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Can't Update User! ${err}`,
    });
  }
};











































