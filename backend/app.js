const express = require("express");
const cors = require("cors");
const path = require("path");
const blogRoute = require("./routes/blogRoute");
const userRoute = require("./routes/userRoute");

const app = express();
app.use(express.json());

// Configure CORS once (allow your frontend origin)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Ensure preflight (OPTIONS) requests are handled for all routes
// Respond to preflight requests for any path
// Note: CORS preflight requests are handled by the cors middleware above.

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
