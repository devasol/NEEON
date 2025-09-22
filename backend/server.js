const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT || 9000;
const DB = process.env.DATABASE_URL;

mongoose
  .connect(DB)
  .then(() => console.log("Database Connected Successfully"))
  .catch((err) => console.log("Database is not Connected", err));

app.listen(port, () => console.log(`Server is Running on port ${port}`));
