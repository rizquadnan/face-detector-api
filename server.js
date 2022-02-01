const express = require("express");

const app = express();
const PORT = 3001;

app.get("/health", (req, res) => {
  res.send("OK");
})

app.listen(PORT, () => console.log(`> Listening on port ${PORT}`));