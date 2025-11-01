const BlogNewsModel = require("./../models/blogModel");
const UserModel = require("./../models/userModel");
const path = require("path");
const fs = require("fs");
//Get Public Blogs (limited, no auth required)
exports.getPublicBlogs = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 3; // Default to 3 posts
    const allBlogs = await BlogNewsModel.find({ status: "Published" }).select("-image").limit(limit);
    
    // Calculate actual counts from arrays to ensure accuracy
    const blogsWithCorrectCounts = allBlogs.map(blog => {
      const blogObj = blog.toObject();
      blogObj.likes = blog.likedBy ? blog.likedBy.length : 0;
      blogObj.comments = blog.commentsList ? blog.commentsList.length : 0;
      return blogObj;
    });
    
    res.status(200).json({
      status: "success",
      message: `Successfully got ${allBlogs.length} public Blogs.`,
      blogs: {
        allBlogs: blogsWithCorrectCounts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: "Can't Get Public Blogs!",
    });
  }
};

//Get All Blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    let query = BlogNewsModel.find().select("-image");

    if (limit) {
      query = query.limit(limit);
    }

    const allBlogs = await query;
    
    // Calculate actual counts from arrays to ensure accuracy
    const blogsWithCorrectCounts = allBlogs.map(blog => {
      const blogObj = blog.toObject();
      blogObj.likes = blog.likedBy ? blog.likedBy.length : 0;
      blogObj.comments = blog.commentsList ? blog.commentsList.length : 0;
      return blogObj;
    });
    
    res.status(200).json({
      status: "success",
      message: limit
        ? `Successfully got ${allBlogs.length} Blogs (limited).`
        : "Successfully got all Blogs.",
      blogs: {
        allBlogs: blogsWithCorrectCounts,
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
        status: "fail",
        message: "Blog not found",
      });
    }

    // Check if user already liked the post
    const alreadyLiked = blog.likedBy.includes(userId);

    let updatedBlog;
    if (alreadyLiked) {
      // Unlike the post
      updatedBlog = await BlogNewsModel.findByIdAndUpdate(blogId, {
        $pull: { likedBy: userId },
        $inc: { likes: -1 },
      }, { new: true }).select("-image");

      // Calculate actual counts from arrays to ensure accuracy in the response
      const blogObj = updatedBlog.toObject();
      blogObj.likes = updatedBlog.likedBy ? updatedBlog.likedBy.length : 0;
      blogObj.comments = updatedBlog.commentsList ? updatedBlog.commentsList.length : 0;

      return res.status(200).json({
        status: "success",
        message: "Blog unliked successfully",
        liked: false,
        likes: blogObj.likes,
        blog: blogObj,
      });
    } else {
      // Like the post
      updatedBlog = await BlogNewsModel.findByIdAndUpdate(blogId, {
        $push: { likedBy: userId },
        $inc: { likes: 1 },
      }, { new: true }).select("-image");

      // Calculate actual counts from arrays to ensure accuracy in the response
      const blogObj = updatedBlog.toObject();
      blogObj.likes = updatedBlog.likedBy ? updatedBlog.likedBy.length : 0;
      blogObj.comments = updatedBlog.commentsList ? updatedBlog.commentsList.length : 0;

      return res.status(200).json({
        status: "success",
        message: "Blog liked successfully",
        liked: true,
        likes: blogObj.likes,
        blog: blogObj,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
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
        status: "fail",
        message: "Comment text is required",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const blog = await BlogNewsModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }

    const newComment = {
      text,
      user: userId,
      username: user.username,
    };

    const updatedBlog = await BlogNewsModel.findByIdAndUpdate(
      blogId,
      {
        $push: { commentsList: newComment },
        $inc: { comments: 1 },
      },
      { new: true }
    ).select("-image");

    // Calculate actual counts from arrays to ensure accuracy in the response
    const blogObj = updatedBlog.toObject();
    blogObj.likes = updatedBlog.likedBy ? updatedBlog.likedBy.length : 0;
    blogObj.comments = updatedBlog.commentsList ? updatedBlog.commentsList.length : 0;

    res.status(200).json({
      status: "success",
      message: "Comment added successfully",
      blog: blogObj,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get all comments for a blog post
exports.getComments = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await BlogNewsModel.findById(blogId)
      .select("commentsList")
      .populate({
        path: "commentsList.user",
        select: "username",
      });

    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }

    res.status(200).json({
      status: "success",
      comments: blog.commentsList,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get all comments across all blog posts
exports.getAllComments = async (req, res) => {
  try {
    console.log("getAllComments endpoint called by user:", req.user ? req.user.id : "unauthenticated");
    console.log("Fetching all comments...");
    const blogs = await BlogNewsModel.find({ commentsList: { $exists: true, $ne: [] } })
      .select("commentsList newsTitle _id")
      .populate({
        path: "commentsList.user",
        select: "username",
      });

    console.log("Found blogs with comments:", blogs.length);

    // Flatten all comments from all blogs into a single array
    let allComments = [];
    if (blogs && blogs.length > 0) {
      blogs.forEach(blog => {
        console.log(`Blog ${blog._id} has ${blog.commentsList.length} comments`);
        if (Array.isArray(blog.commentsList)) {
          blog.commentsList.forEach(comment => {
            allComments.push({
              ...comment._doc,
              post: blog.newsTitle,
              postId: blog._id
            });
          });
        }
      });
    }

    console.log("Total comments found:", allComments.length);

    // Sort by creation date (newest first)
    if (allComments.length > 0) {
      allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({
      status: "success",
      comments: allComments,
    });
  } catch (err) {
    console.error("Error in getAllComments:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete a specific comment from a blog post
exports.deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;

    const blog = await BlogNewsModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }

    // Find the index of the comment to delete
    const commentIndex = blog.commentsList.findIndex(comment => 
      comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({
        status: "fail",
        message: "Comment not found",
      });
    }

    // Remove the comment from the commentsList
    blog.commentsList.splice(commentIndex, 1);
    
    // Update the blog document with the modified commentsList and decrement the counter
    const updatedBlog = await BlogNewsModel.findByIdAndUpdate(
      blogId,
      { 
        commentsList: blog.commentsList,
        $inc: { comments: -1 }
      },
      { new: true }
    ).select("-image");

    // Calculate actual counts from arrays to ensure accuracy in the response
    const blogObj = updatedBlog.toObject();
    blogObj.likes = updatedBlog.likedBy ? updatedBlog.likedBy.length : 0;
    blogObj.comments = updatedBlog.commentsList ? updatedBlog.commentsList.length : 0;

    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
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

    // Calculate actual counts from arrays to ensure accuracy
    const blogResponse = newBlog.toObject();
    blogResponse.likes = newBlog.likedBy ? newBlog.likedBy.length : 0;
    blogResponse.comments = newBlog.commentsList ? newBlog.commentsList.length : 0;
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
    
    if (!blog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }

    // Calculate actual counts from arrays to ensure accuracy
    const blogObj = blog.toObject();
    blogObj.likes = blog.likedBy ? blog.likedBy.length : 0;
    blogObj.comments = blog.commentsList ? blog.commentsList.length : 0;

    res.status(200).json({
      status: "success",
      message: "Successfully got a Blog.",
      blog: {
        blog: blogObj,
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

    if (updatedBlog) {
      // Calculate actual counts from arrays to ensure accuracy
      const response = updatedBlog.toObject();
      response.likes = updatedBlog.likedBy ? updatedBlog.likedBy.length : 0;
      response.comments = updatedBlog.commentsList ? updatedBlog.commentsList.length : 0;
      
      res.status(200).json({
        status: "success",
        message: "Blog updated successfully.",
        blog: {
          updatedBlog: response,
        },
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }
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
    const deletedBlog = await BlogNewsModel.findById(id);
    
    if (!deletedBlog) {
      return res.status(404).json({
        status: "fail",
        message: "Blog not found",
      });
    }
    
    // Calculate actual counts from arrays to ensure accuracy in the response
    const blogObj = deletedBlog.toObject();
    blogObj.likes = deletedBlog.likedBy ? deletedBlog.likedBy.length : 0;
    blogObj.comments = deletedBlog.commentsList ? deletedBlog.commentsList.length : 0;
    
    await BlogNewsModel.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Blog deleted successfully.",
      blog: {
        deletedBlog: blogObj,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: `Can't Delete Blog! ${err}`,
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
