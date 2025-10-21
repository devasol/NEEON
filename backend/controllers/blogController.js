const BlogNewsModel = require("./../models/blogModel");
const UserModel = require("./../models/userModel");
const path = require("path");
const fs = require("fs");
//Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await BlogNewsModel.find().select("-image");
    res.status(200).json({
      status: "success",
      message: "Successfully got all Blogs.",
      blogs: {
        allBlogs,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Can't Get All Blogs!",
    });
  }
};

// Like a blog post
exports.likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log("req.user in likeBlog:", req.user);
    const userId = req.user.id;

    const blog = await BlogNewsModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Blog not found'
      });
    }

    // Check if user already liked the post
    const alreadyLiked = blog.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Unlike the post
      await BlogNewsModel.findByIdAndUpdate(blogId, {
        $pull: { likedBy: userId },
        $inc: { likes: -1 }
      });
      
      return res.status(200).json({
        status: 'success',
        message: 'Blog unliked successfully',
        liked: false
      });
    } else {
      // Like the post
      await BlogNewsModel.findByIdAndUpdate(blogId, {
        $push: { likedBy: userId },
        $inc: { likes: 1 }
      });
      
      return res.status(200).json({
        status: 'success',
        message: 'Blog liked successfully',
        liked: true
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Add a comment to a blog post
exports.addComment = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log("req.user in addComment:", req.user);
    const userId = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 'fail',
        message: 'Comment text is required'
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    const blog = await BlogNewsModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Blog not found'
      });
    }

    const newComment = {
      text,
      user: userId,
      username: user.username
    };

    const updatedBlog = await BlogNewsModel.findByIdAndUpdate(
      blogId,
      {
        $push: { commentsList: newComment },
        $inc: { comments: 1 }
      },
      { new: true }
    ).select('-image');

    res.status(200).json({
      status: 'success',
      message: 'Comment added successfully',
      blog: updatedBlog
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Get all comments for a blog post
exports.getComments = async (req, res) => {
  try {
    const blogId = req.params.id;
    
    const blog = await BlogNewsModel.findById(blogId)
      .select('commentsList')
      .populate({
        path: 'commentsList.user',
        select: 'username'
      });
      
    if (!blog) {
      return res.status(404).json({
        status: 'fail',
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      status: 'success',
      comments: blog.commentsList
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.createBlog = async (req, res) => {
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
          // NOTE: previously we removed the uploaded file from disk here.
          // To preserve uploads in the `uploads/` folder, we intentionally do NOT unlink the file.
        }
      }
    }

    const newBlog = await BlogNewsModel.create({
      ...req.body,
      image: imageValue,
    });

    const blogResponse = newBlog.toObject();
    if (blogResponse.image) delete blogResponse.image;

    res.status(200).json({
      status: "success",
      message: "Blog post created successfully",
      blog: blogResponse,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
//Get a Blog
exports.getBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await BlogNewsModel.findById(id).select("-image");

    res.status(200).json({
      status: "success",
      message: "Successfully got a Blog.",
      blog: {
        blog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Can't Get Blog! ${err}`,
    });
  }
};
//Updating a Blog
exports.updateBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const body = { ...req.body };

    // handle image if uploaded via multer memoryStorage
    if (req.file) {
      if (req.file.buffer) {
        body.image = { data: req.file.buffer, contentType: req.file.mimetype };
      } else if (req.file.path) {
        // disk-based upload
        const filePath = path.join(__dirname, "..", req.file.path);
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          body.image = { data: fileBuffer, contentType: req.file.mimetype };
        }
      }
    }

    const updatedBlog = await BlogNewsModel.findOneAndUpdate(
      { _id: id },
      { $set: body },
      { new: true, runValidators: true }
    ).select("-image");

    const response = updatedBlog ? updatedBlog.toObject() : null;
    res.status(200).json({
      status: "success",
      message: "Blog updated successfully.",
      blog: {
        updatedBlog: response,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Can't Update Blog! ${err}`,
    });
  }
};

//Deleting a Blog
exports.deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBlog = await BlogNewsModel.findOneAndDelete({
      _id: id,
    }).select("-image");

    res.status(200).json({
      status: "success",
      message: "Blog deleted successfully.",
      blog: {
        deletedBlog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Can't Update Blog! ${err}`,
    });
  }
};


exports.getImage = async (req, res) => {
  try {
    const blog = await BlogNewsModel.findById(req.params.id);

    if (!blog || !blog.image) {
      return res.status(404).send("Image not found");
    }

    // If image stored in MongoDB as { data: Buffer, contentType: String }
    if (blog.image.data) {
      // blog.image.data may already be a Buffer or a plain object when serialized
      let buffer;
      if (Buffer.isBuffer(blog.image.data)) {
        buffer = blog.image.data;
      } else if (Array.isArray(blog.image.data)) {
        buffer = Buffer.from(blog.image.data);
      } else if (blog.image.data.data && Array.isArray(blog.image.data.data)) {
        // sometimes it's { data: { type: 'Buffer', data: [...] } }
        buffer = Buffer.from(blog.image.data.data);
      }

      if (buffer) {
        const contentType =
          blog.image.contentType || "application/octet-stream";
        res.set("Content-Type", contentType);
        return res.send(buffer);
      }
    }

    // If image stored as a path string (e.g. 'uploads/xxx.jpg')
    if (typeof blog.image === "string") {
      const imagePath = path.join(__dirname, "..", blog.image);
      if (!fs.existsSync(imagePath)) {
        return res.status(404).send("Image file missing");
      }
      return res.sendFile(imagePath);
    }

    // Fallback: not a recognized format
    return res.status(404).send("Image not available");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
