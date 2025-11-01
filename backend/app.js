const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");
const analyticsRouter = require("./routes/analyticsRoute");
const googleAuthRoute = require("./routes/googleAuthRoute");
const contactRoute = require("./routes/contactRoute");
const globalErrorHandler = require("./controllers/errorController");

const app = express();


app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());


const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); 
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



app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/v1/blogs", blogRouter);
app.use("/api/categories", categoryRouter);


app.use("/api/v1/users", userRoute);


app.use("/api/v1/analytics", analyticsRouter);


app.use("/auth", googleAuthRoute);


app.use("/api", contactRoute);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use((req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on the Server!`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
