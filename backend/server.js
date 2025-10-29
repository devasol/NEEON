const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/userModel.js");

// Load environment variables
dotenv.config({ path: "./config.env" });

// Initialize Passport configuration
require("./config/passport");

const app = require("./app");

const port = process.env.PORT || 9000;
const DB = process.env.DATABASE_URL;

mongoose
  .connect(DB)
  .then(() => {
    console.log("Database Connected Successfully");
    User.init()
      .then(() => console.log("Indexes are ready ✅"))
      .catch((err) => console.error("Index error:", err));
  })
  .catch((err) => console.log("Database is not Connected", err));

app.listen(port, () => console.log(`Server is Running on port ${port}`));
