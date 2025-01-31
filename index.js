const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const chatRouter = require("./routes/chatRouter");
const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

async function connectToMongo() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (err) {
    console.error("Error connecting to MongoDB Atlas:", err);
  }
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", chatRouter);
app.use("/images", express.static(path.join(__dirname, "images")));

app.listen(process.env.PORT, () => {
  connectToMongo().then(() => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
