const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*"
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("AI Startup Validator API Running");
});

// Routes
const ideaRoutes = require("./routes/ideas");
app.use("/ideas", ideaRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () =>
      console.log("Server running on http://localhost:5000")
    );
  })
  .catch((err) => console.error(err));
