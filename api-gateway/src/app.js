const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/baseRouter'));


app.use((err, req, res, next) => {
  console.error("Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message
  });
});
module.exports = app;