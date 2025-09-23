const express = require("express");
const path = require("path");
const blogRoute = require("./routes/blogRoute");
const userRoute = require("./routes/userRoute");

const app = express();
app.use(express.json());
// serve uploaded files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Blogs Route
app.use("/api/v1/blogs", blogRoute);

//users Route
app.use("/api/v1/users", userRoute);

// catch-all for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on the Server!`,
  });
});
module.exports = app;
