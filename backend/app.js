const express = require("express");
const cors = require("cors");
const path = require("path");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
app.use(express.json());

// Configure CORS using middleware and handle preflight requests
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // allow in dev for other local origins
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  })
);
// Note: CORS middleware above already handles preflight; explicit app.options is unnecessary

// serve uploaded files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Blogs Route
app.use("/api/v1/blogs", blogRouter);
app.use("/api/categories", categoryRouter);

//users Route
app.use("/api/v1/users", userRoute);

// health endpoint for readiness checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// catch-all for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on the Server!`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
