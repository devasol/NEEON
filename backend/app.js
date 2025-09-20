const express = require("express");
const app = express();

const port = 9000;
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Successfull",
  });
});

app.listen(port, () => console.log(`Server is Running on port ${port}`));
