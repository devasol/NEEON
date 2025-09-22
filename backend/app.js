const express = require("express");
const router = require("./routes/blogRoute");

const app = express();
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/blogs", router);

module.exports = app;
